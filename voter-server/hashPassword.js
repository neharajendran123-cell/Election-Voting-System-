import bcrypt from "bcrypt";

const hashPassword = async () => {
  const hashedPassword = await bcrypt.hash("Kalabam#", 10);
  console.log("Hashed Password:", hashedPassword);
};

hashPassword();
