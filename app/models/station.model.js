const stationSchema = {
  name: '',
  address1: '',
  address2: '',
  city: '',
  state: '',
  pincode: '',
  location: {
    type: 'Point',
    coordinates: [23.01, 72.02]
  },
  chargerIds: [],
  ratings: 0,
  customerType: null,
  status: 'Unavailable',
  amenities: [],
  images: []
};

module.exports = stationSchema;
