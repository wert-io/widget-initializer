const ALL_OPTIONS_FILLED = {
  partner_id: 'default',
  click_id: '12345', 
  origin: 'https://sandbox.wert.io', 
  lang: 'fr',
  address: 'test-address', 
  theme: 'dark',
  currency_amount: 10,
  country_of_residence: 'USA', 
  state_of_residence: 'NY',
  date_of_birth: '01/01/2001', 
  full_name: 'TEST TEST',
  commodity: 'ETH',
  network: 'goerli', 
  phone: '+11014321111',
  email: 'test@test.com',
  skip_init_navigation: 'true', 
  is_crypto_hidden: 'true',
  sc_address: 'test-sc-address',
  sc_input_data: 'test-sc-input-data',
  signature: 'signature'
};

const MINIMUM_OPTIONS_FILLED = {
  partner_id: 'default',
  origin: 'https://sandbox.wert.io',
};

const COMMODITIES = [{"commodity":"GHST","network":"mumbai"}, {"commodity":"STX","network":"testnet"}];

const WALLETS = [
  {
    name: 'BTC',
    network: 'testnet',
    address: 'btc-address'
  }
];

module.exports = {
  ALL_OPTIONS_FILLED,
  MINIMUM_OPTIONS_FILLED,
  COMMODITIES,
  WALLETS
};