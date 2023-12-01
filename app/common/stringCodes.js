module.exports = {
  // 'Requested Action is not known by receiver'
  NotImplemented: 'NotImplemented',

  // 'Requested Action is recognized but not supported by the receiver',
  NotSupported: 'NotSupported',

  // An internal error occurred and the receiver was not able to process the requested Action successfully
  InternalError: 'InternalError',

  // Payload for Action is incomplete
  ProtocolError: 'ProtocolError',

  // During the processing of Action a security issue occurred preventing receiver from completing the Action successfully
  SecurityError: 'SecurityError',

  // Payload for Action is syntactically incorrect or not conform the PDU structure for Action
  FormationViolation: 'FormationViolation',

  // Payload is syntactically correct but at least one field contains an invalid value
  PropertyConstraintViolation: 'PropertyConstraintViolation',

  // Payload for Action is syntactically correct but at least one of the fields violates occurence constraints
  OccurenceConstraintViolation: 'OccurenceConstraintViolation',

  // Payload for Action is syntactically correct but at least one of the fields violates data type constraints (e.g. “somestring”: 12)
  TypeConstraintViolation: 'TypeConstraintViolation',

  // Any other error not covered by the previous ones
  GenericError: 'GenericError',
  AUTHORIZE: 'Authorize',
  BOOT_NOTIFICATION: 'BootNotification',
  CHANGE_AVAILABILITY: 'ChangeAvailability',
  CHANGE_CONFIGURATION: 'ChangeConfiguration',
  CLEAR_CACHE: 'ClearCache',
  CLEAR_CHARGING_PROFILE: 'ClearChargingProfile',
  DATA_TRANSFER: 'DataTransfer',
  DIAGNOSTICS_STATUS_NOTIFICATION: 'DiagnosticsStatusNotification',
  FIRMWARE_STATUS_NOTIFICATION: 'FirmwareStatusNotification',
  GET_COMPOSITE_SCHEDULE: 'GetCompositeSchedule',
  GET_CONFIGURATION: 'GetConfiguration',
  GET_DIAGNOSTICS: 'GetDiagnostics',
  GET_LOCAL_LIST_VERSION: 'GetLocalListVersion',
  GET_LOCAL_LIST: 'GetLocalList',
  HEARTBEAT: 'Heartbeat',
  METER_VALUE: 'MeterValues',
  REMOTE_START_TRANSACTION: 'RemoteStartTransaction',
  REMOTE_STOP_TRANSACTION: 'RemoteStopTransaction',
  RESERVE_NOW: 'ReserveNow',
  CANCEL_RESERVATION: 'CancelReservation',
  RESET: 'Reset',
  SEND_LOCAL_LIST: 'SendLocalList',
  SET_CHARGING_PROFILE: 'SetChargingProfile',
  START_TRANSACTION: 'StartTransaction',
  STATUS_NOTIFICATION: 'StatusNotification',
  STOP_TRANSACTION: 'StopTransaction',
  TRIGGER_MESSAGE: 'TriggerMessage',
  UNLOCK_CONNECTOR: 'UnlockConnector',
  UPDATE_FIRMWARE: 'UpdateFirmware',
  EXTENDED_TRIGGER_MESSAGE: 'ExtendedTriggerMessage',
  INSTALL_CERTIFICATE: 'InstallCertificate',
  CERTIFICATE_SIGNED: 'CertificateSigned',
  GET_INSTALLED_CERTIFICATE_IDS: 'GetInstalledCertificateIds',
  DELETE_CERTIFICATE: 'DeleteCertificate',
  GET_LOG: 'GetLog',
  SIGNED_UPDATE_FIRMWARE: 'SignedUpdateFirmware',
  TRIGGER_REQUESTED_MESSAGE: {
    BN: 'BootNotification',
    HB: 'Heartbeat',
    MV: 'MeterValues',
    SN: 'StatusNotification',
    DSN: 'DiagnosticsStatusNotification',
    FSN: 'FirmwareStatusNotification'
  },
  EXTENDED_TRIGGER_REQUESTED_MESSAGE: {
    BN: 'BootNotification',
    LSN: 'LogStatusNotification',
    FSN: 'FirmwareStatusNotification',
    HB: 'Heartbeat',
    MV: 'MeterValues',
    SN: 'StatusNotification',
    SCPC: 'SignChargePointCertificate'
  },
  CUSTOMER_TYPE: {
    FLEET_OPERATOR: 'Fleet Operator',
    HOUSING_SOCIETY: 'Housing Society',
    PUBLIC_PLACE: 'Public Place',
    HIGWAY: 'Highway',
    OFFICE: 'Office',
    OTHER: 'Other'
  },
  STATES_OF_INDIA: {
    AP: 'Andra Pradesh',
    AR: 'Arunachal Pradesh',
    AS: 'Assam',
    BR: 'Bihar',
    CG: 'Chhattisgarh',
    GA: 'Goa',
    GJ: 'Gujarat',
    HR: 'Haryana',
    HP: 'Himachal Pradesh',
    JK: 'Jammu and Kashmir',
    JH: 'Jharkhand',
    KA: 'Karnataka',
    KL: 'Kerala',
    MP: 'Madhya Pradesh',
    MH: 'Maharashtra',
    MN: 'Manipur',
    ML: 'Meghalaya',
    MZ: 'Mizoram',
    NL: 'Nagaland',
    OR: 'Odisha',
    PB: 'Punjab',
    RJ: 'Rajasthan',
    SK: 'Sikkim',
    TN: 'Tamil Nadu',
    TR: 'Tripura',
    TS: 'Telangana',
    UT: 'Uttarakhand',
    UP: 'Uttar Pradesh',
    WB: 'West Bengal',
    AN: 'Andaman and Nicobar',
    CH: 'Chandigarh',
    DN: 'Dadra and Nagar Haveli',
    DL: 'Delhi',
    LK: 'Lakshadweep',
    PY: 'Puducherry'
  },
  STATUS: {
    ACTIVE: 'Active',
    CLOSED: 'Closed',
    INACTIVE: 'Inactive'
  },
  GUN_TYPE: {
    AC: 'AC',
    AC_T2: 'AC Type 2',
    CCS: 'DC CCS2',
    CHADEMO: 'DC CHADEMO',
    GBT: 'DC GB/T'
  },
  GUN_STATUS: {
    AVAI: 'Available',
    PREP: 'Preparing',
    CHAR: 'Charging',
    SUS: 'SuspendedEV',
    FIN: 'Finishing',
    RES: 'Reserved',
    UN: 'Unavailable',
    FAL: 'Faulted'
  },
  TRANSACTION_STATUS: {
    NO_USER: 1,
    GUN_CONNECTED: 2,
    START_CMD: 3,
    CHARGE_START: 4,
    CHARGE_ABORT: 5,
    CHARGE_STOP: 6
  },
  DB_NAME: {
    COMPANIES: 'companies',
    CHARGERS: 'chargers',
    MANUFACTURERS: 'manufacturers'
  }
};
