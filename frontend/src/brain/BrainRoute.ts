import {
  CheckHealthData,
  DetectScamData,
  GetScanByIdData,
  GetScanHistoryData,
  ScamDetectionRequest,
} from "./data-contracts";

export namespace Brain {
  /**
   * @description Check health of application. Returns 200 when OK, 500 when not.
   * @name check_health
   * @summary Check Health
   * @request GET:/_healthz
   */
  export namespace check_health {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = CheckHealthData;
  }

  /**
   * No description
   * @tags dbtn/module:scam_detection
   * @name detect_scam
   * @summary Detect Scam
   * @request POST:/routes/detect
   */
  export namespace detect_scam {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ScamDetectionRequest;
    export type RequestHeaders = {};
    export type ResponseBody = DetectScamData;
  }

  /**
   * No description
   * @tags dbtn/module:scam_detection
   * @name get_scan_history
   * @summary Get Scan History
   * @request GET:/routes/history
   */
  export namespace get_scan_history {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * Limit
       * @default 10
       */
      limit?: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetScanHistoryData;
  }

  /**
   * No description
   * @tags dbtn/module:scam_detection
   * @name get_scan_by_id
   * @summary Get Scan By Id
   * @request GET:/routes/scan/{scan_id}
   */
  export namespace get_scan_by_id {
    export type RequestParams = {
      /** Scan Id */
      scanId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetScanByIdData;
  }
}
