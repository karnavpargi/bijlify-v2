const tarrifConfigSchema = {
  start: '00:00',
  end: '23:59',
  tariff: '00.00'
};

const chargerSchema = {
  chargerId: '',
  chargerUid: '',
  connectorId: '',
  gunType: '',
  capacity: '',
  tariff: '',
  tariffConfig: [],
  meterValues: {
    energyImport: 0,
    voltage: 0,
    current: 0,
    temperature: 0,
    soc: 0,
    power: 0,
    timeStamp: ''
  },
  connectorStatus: 'Unavailable',
  hrTimeStamp: '',
  liveTransaction: {
    userId: 0,
    idTag: 0,
    startKwh: 0,
    purchasedKwh: 0,
    transactionId: 0,
    TransStatus: 1,
    timeStamp: ''
  },
  lastTransaction: {
    userId: 0,
    idTag: 0,
    startKwh: 0,
    purchasedKwh: 0,
    transactionId: 0,
    TransStatus: 1,
    timeStamp: ''
  },
  status: 'Unavailable'
};

module.exports = { chargerSchema, tarrifConfigSchema };
