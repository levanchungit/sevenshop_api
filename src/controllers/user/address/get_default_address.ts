import User from "models/user";

const getDefaultAddress = async (id: string) => {
  try {
    const user = await User.findById(id);
    if (!user) return null;
    const address = user.addresses.find((item) => item.default_address);
    if (!address) return null;
    return address;
  } catch (err) {
    return null;
  }
};

export default getDefaultAddress;
