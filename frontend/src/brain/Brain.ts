import {
  CheckHealthData,
  DetectScamData,
  DetectScamError,
  GetScanByIdData,
  GetScanByIdError,
  GetScanByIdParams,
  GetScanHistoryData,
  GetScanHistoryError,
  GetScanHistoryParams,
  ScamDetectionRequest,
} from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class Brain<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * @description Check health of application. Returns 200 when OK, 500 when not.
   *
   * @name check_health
   * @summary Check Health
   * @request GET:/_healthz
   */
  check_health = (params: RequestParams = {}) =>
    this.request<CheckHealthData, any>({
      path: `/_healthz`,
      method: "GET",
      ...params,
    });

  /**
   * No description
   *
   * @tags dbtn/module:scam_detection
   * @name detect_scam
   * @summary Detect Scam
   * @request POST:/routes/detect
   */
  detect_scam = (data: ScamDetectionRequest, params: RequestParams = {}) =>
    this.request<DetectScamData, DetectScamError>({
      path: `/routes/detect`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * No description
   *
   * @tags dbtn/module:scam_detection
   * @name get_scan_history
   * @summary Get Scan History
   * @request GET:/routes/history
   */
  get_scan_history = (query: GetScanHistoryParams, params: RequestParams = {}) =>
    this.request<GetScanHistoryData, GetScanHistoryError>({
      path: `/routes/history`,
      method: "GET",
      query: query,
      ...params,
    });

  /**
   * No description
   *
   * @tags dbtn/module:scam_detection
   * @name get_scan_by_id
   * @summary Get Scan By Id
   * @request GET:/routes/scan/{scan_id}
   */
  get_scan_by_id = ({ scanId, ...query }: GetScanByIdParams, params: RequestParams = {}) =>
    this.request<GetScanByIdData, GetScanByIdError>({
      path: `/routes/scan/${scanId}`,
      method: "GET",
      ...params,
    });
}
