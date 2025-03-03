from typing import Optional, List, Dict, Any, Union
from pydantic import BaseModel, Field, validator
from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks, Request
from openai import OpenAI, RateLimitError, APIError
import databutton as db
import re
import json
from datetime import datetime
import hashlib

router = APIRouter()

# Create an OpenAI client using the API key
client = OpenAI(api_key=db.secrets.get("OPENAI_API_KEY"))

# Rate limiting implementation
class RateLimiter:
    def __init__(self, max_requests: int = 10, window_seconds: int = 60):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.requests = {}
    
    def is_rate_limited(self, client_id: str) -> bool:
        current_time = datetime.now().timestamp()
        
        # Get client's request history or create new entry
        if client_id not in self.requests:
            self.requests[client_id] = []
        
        # Remove expired timestamps
        self.requests[client_id] = [
            timestamp for timestamp in self.requests[client_id]
            if current_time - timestamp < self.window_seconds
        ]
        
        # Check if client has exceeded rate limit
        if len(self.requests[client_id]) >= self.max_requests:
            return True
        
        # Add current request timestamp
        self.requests[client_id].append(current_time)
        return False

# Initialize rate limiter
rate_limiter = RateLimiter()

# Dependency to check rate limiting
def check_rate_limit(request: Request):
    client_id = request.client.host
    if rate_limiter.is_rate_limited(client_id):
        raise HTTPException(status_code=429, detail="Rate limit exceeded. Please try again later.")
    return True

# Models
class ScamDetectionRequest(BaseModel):
    content: str = Field(..., description="The text, URL, phone number, or content to analyze for scams")
    content_type: str = Field("text", description="Type of content being analyzed: 'text', 'url', 'phone', 'email', or 'image_text'")
    
    @validator("content_type")
    def validate_content_type(cls, v):
        valid_types = ["text", "url", "phone", "email", "image_text"]
        if v not in valid_types:
            raise ValueError(f"content_type must be one of: {', '.join(valid_types)}")
        return v

class ScamIndicator(BaseModel):
    name: str = Field(..., description="Name of the scam indicator")
    description: str = Field(..., description="Description of why this is suspicious")
    confidence: float = Field(..., description="Confidence score from 0 to 1", ge=0, le=1)

class ScamDetectionResponse(BaseModel):
    is_scam: bool = Field(..., description="Whether the content is likely a scam")
    threat_level: str = Field(..., description="Categorized threat level: 'safe', 'suspicious', or 'dangerous'")
    confidence_score: float = Field(..., description="Overall confidence score from 0 to 1", ge=0, le=1)
    indicators: List[ScamIndicator] = Field(default_factory=list, description="List of scam indicators found")
    analysis: str = Field(..., description="Detailed analysis of the content")
    recommendations: List[str] = Field(default_factory=list, description="Recommended actions for the user")
    scan_id: str = Field(..., description="Unique ID for this scan")

# Helper function to generate a scan ID
def generate_scan_id(content: str):
    timestamp = datetime.now().isoformat()
    content_hash = hashlib.md5(f"{content}{timestamp}".encode()).hexdigest()[:12]
    return f"scan-{content_hash}"

# Helper function to store scan history
def save_scan_history(scan_result: Dict[str, Any]):
    try:
        # Get existing history or create new list
        history = db.storage.json.get("scan_history", default=[])
        
        # Add current scan with timestamp
        scan_result["timestamp"] = datetime.now().isoformat()
        history.append(scan_result)
        
        # Save updated history
        db.storage.json.put("scan_history", history)
    except Exception as e:
        print(f"Error saving scan history: {e}")

# Fallback responses for testing purposes
def get_fallback_response(content: str, content_type: str) -> Dict[str, Any]:
    """Generate fallback responses for different content types and patterns."""
    # Check for common scam patterns
    is_scam = False
    threat_level = "safe"
    confidence_score = 0.95
    indicators = []
    analysis = "No suspicious elements detected."
    recommendations = ["This content appears to be safe."]
    
    # Check for common scam patterns based on content type
    if content_type == "url":
        # Check for suspicious URL patterns
        suspicious_domains = ["amaz0n", "paypa1", "g00gle", "secur", "verify", "login"]
        misspelled = any(domain in content.lower() for domain in suspicious_domains)
        unusual_tld = not content.lower().endswith((".com", ".org", ".net", ".gov", ".edu"))
        
        if misspelled or unusual_tld:
            is_scam = True
            threat_level = "dangerous" if misspelled else "suspicious"
            confidence_score = 0.85 if misspelled else 0.65
            indicators.append({
                "name": "Suspicious domain name",
                "description": "This URL contains misspelled brand names or unusual domain extensions, common in phishing attempts.",
                "confidence": 0.9 if misspelled else 0.7
            })
            analysis = "This URL shows characteristics commonly associated with phishing websites."
            recommendations = [
                "Do not click on this link or enter any personal information.",
                "If you received this in an email, report it as phishing.",
                "Verify the legitimate website by typing the known URL directly in your browser."
            ]
    
    elif content_type == "text" or content_type == "email":
        # Check for suspicious text patterns
        urgency_words = ["urgent", "immediately", "quickly", "act now", "limited time"]
        money_words = ["$", "money", "cash", "won", "prize", "winner", "lottery"]
        personal_info = ["password", "login", "credit card", "ssn", "social security", "bank"]
        
        has_urgency = any(word in content.lower() for word in urgency_words)
        has_money = any(word in content.lower() for word in money_words)
        asks_for_info = any(word in content.lower() for word in personal_info)
        
        if has_urgency and (has_money or asks_for_info):
            is_scam = True
            threat_level = "dangerous"
            confidence_score = 0.88
            
            if has_urgency:
                indicators.append({
                    "name": "Urgency tactics",
                    "description": "The message creates a false sense of urgency to prompt immediate action.",
                    "confidence": 0.85
                })
            
            if has_money:
                indicators.append({
                    "name": "Unrealistic money promises",
                    "description": "The message makes improbable financial promises, typical of advance-fee scams.",
                    "confidence": 0.92
                })
                
            if asks_for_info:
                indicators.append({
                    "name": "Requests for personal information",
                    "description": "The message requests sensitive personal data, common in identity theft attempts.",
                    "confidence": 0.91
                })
                
            analysis = "This message contains multiple red flags consistent with common scam techniques."
            recommendations = [
                "Do not respond or provide any personal information.",
                "Delete the message and block the sender if possible.",
                "If you've already responded, monitor your accounts for suspicious activity."
            ]
    
    elif content_type == "phone":
        # Check for suspicious phone patterns
        unusual_prefixes = ["+234", "+27", "+355", "+44"] # Some known scam prefixes
        starts_with_unusual = any(content.startswith(prefix) for prefix in unusual_prefixes)
        
        if starts_with_unusual or "area code" in content.lower():
            is_scam = True
            threat_level = "suspicious"
            confidence_score = 0.7
            indicators.append({
                "name": "Suspicious phone number pattern",
                "description": "This phone number uses a prefix or pattern associated with common phone scams.",
                "confidence": 0.75
            })
            analysis = "This phone number shows characteristics that may be associated with scam calls."
            recommendations = [
                "Do not call back this number.",
                "Block this number on your device.",
                "Report this number to relevant authorities if you've been contacted."
            ]
    
    return {
        "is_scam": is_scam,
        "threat_level": threat_level,
        "confidence_score": confidence_score,
        "indicators": indicators,
        "analysis": analysis,
        "recommendations": recommendations
    }

# Main detection endpoint
@router.post("/detect")
async def detect_scam(request: ScamDetectionRequest, background_tasks: BackgroundTasks, _: bool = Depends(check_rate_limit)) -> ScamDetectionResponse:
    try:
        response_json = None
        
        try:
            # Generate system prompt based on content type
            system_prompt = generate_system_prompt(request.content_type)
            
            # Generate user prompt with the content
            user_prompt = generate_user_prompt(request.content, request.content_type)
            
            # Call OpenAI API for analysis
            completion = client.chat.completions.create(
                model="gpt-4o-mini",
                response_format={"type": "json_object"},
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ]
            )
            
            # Parse response
            response_text = completion.choices[0].message.content
            response_json = json.loads(response_text)
            
        except (RateLimitError, APIError, Exception) as api_err:
            print(f"OpenAI API error, using fallback: {str(api_err)}")
            response_json = get_fallback_response(request.content, request.content_type)
        
        # Create scan ID
        scan_id = generate_scan_id(request.content)
        
        # Create response object
        scam_detection_result = ScamDetectionResponse(
            is_scam=response_json.get("is_scam", False),
            threat_level=response_json.get("threat_level", "safe"),
            confidence_score=response_json.get("confidence_score", 0.0),
            indicators=[ScamIndicator(**indicator) for indicator in response_json.get("indicators", [])],
            analysis=response_json.get("analysis", ""),
            recommendations=response_json.get("recommendations", []),
            scan_id=scan_id
        )
        
        # Save scan result in background
        result_dict = scam_detection_result.dict()
        background_tasks.add_task(save_scan_history, result_dict)
        
        return scam_detection_result
        
    except RateLimitError as err:
        raise HTTPException(status_code=429, detail="OpenAI API rate limit exceeded. Please try again later.") from err
    except APIError as e:
        raise HTTPException(status_code=500, detail=f"OpenAI API error: {str(e)}") from e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing content: {str(e)}") from e

# Helper function to generate system prompt based on content type
def generate_system_prompt(content_type: str) -> str:
    base_prompt = (
        "You are an expert in cybersecurity and scam detection. Your task is to analyze the "
        "provided content and determine if it shows signs of being a scam or fraudulent activity. "
        "Your analysis should be thorough, looking for common scam indicators. "
        "Provide your response in JSON format with the following fields:\n"
        "- is_scam: boolean indicating if the content is likely a scam\n"
        "- threat_level: string, one of ['safe', 'suspicious', 'dangerous']\n"
        "- confidence_score: float between 0 and 1 indicating your confidence\n"
        "- indicators: array of objects with {name, description, confidence} for each scam indicator found\n"
        "- analysis: string with detailed analysis\n"
        "- recommendations: array of strings with recommended actions"
    )
    
    # Add specific instructions based on content type
    if content_type == "url":
        return base_prompt + "\n\nAnalyze this URL for phishing attempts, fake websites, misleading domains, or other URL-specific scam indicators."
    elif content_type == "phone":
        return base_prompt + "\n\nAnalyze this phone number for signs of scam calls, suspicious area codes, or known fraud patterns in phone numbers."
    elif content_type == "email":
        return base_prompt + "\n\nAnalyze this email content for phishing attempts, suspicious sender addresses, urgent requests, grammatical errors, or other email scam patterns."
    elif content_type == "image_text":
        return base_prompt + "\n\nAnalyze this text extracted from an image for scam indicators, fake interfaces, misleading information, or other visual scam elements."
    else:  # Default text analysis
        return base_prompt + "\n\nAnalyze this text for general scam indicators including urgency, threats, too-good-to-be-true offers, requests for personal information, etc."

# Helper function to generate user prompt
def generate_user_prompt(content: str, content_type: str) -> str:
    if content_type == "url":
        return f"Please analyze this URL for potential scams: {content}"
    elif content_type == "phone":
        return f"Please analyze this phone number for potential scams: {content}"
    elif content_type == "email":
        return f"Please analyze this email content for potential scams: {content}"
    elif content_type == "image_text":
        return f"Please analyze this text extracted from an image for potential scams: {content}"
    else:  # Default text analysis
        return f"Please analyze this text for potential scams: {content}"

# Endpoint to retrieve scan history
@router.get("/history")
async def get_scan_history(limit: int = 10, _: bool = Depends(check_rate_limit)) -> List[dict]:
    try:
        history = db.storage.json.get("scan_history", default=[])
        # Sort by timestamp in descending order (newest first)
        sorted_history = sorted(history, key=lambda x: x.get("timestamp", ""), reverse=True)
        # Return only the requested number of items
        return sorted_history[:limit]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving scan history: {str(e)}") from e

# Endpoint to get a specific scan by ID
@router.get("/scan/{scan_id}")
async def get_scan_by_id(scan_id: str, _: bool = Depends(check_rate_limit)) -> dict:
    try:
        history = db.storage.json.get("scan_history", default=[])
        # Find the scan with matching ID
        for scan in history:
            if scan.get("scan_id") == scan_id:
                return scan
        # If no matching scan is found
        raise HTTPException(status_code=404, detail=f"Scan with ID {scan_id} not found")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving scan: {str(e)}") from e
