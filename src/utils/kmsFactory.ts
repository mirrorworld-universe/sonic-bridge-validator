import { AWSKMSService } from "./kmsAws";
import { GCPKMSService } from "./kmsGcp";
import base from "../config/base";

import type { IKMSService } from './kms';

export function getKMSService(): IKMSService {
    switch (base.kms.provider) {
      case "GCP":
        return new GCPKMSService();
      case "AWS":
      default:
        return new AWSKMSService();
    }
  }