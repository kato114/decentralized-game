import addresses from '../db/dbAddresses';

export default async (req, res) => {
  res.send(addresses);
};
