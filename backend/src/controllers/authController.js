import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


// REGISTER USER
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role = "user" } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const { error } = await supabase.from("users").insert([
      {
        name,
        email,
        password: hashedPassword,
        role,
        is_active: true,
      },
    ]);

    if (error) return res.status(400).json({ error });

    return res.json({ message: "User registered successfully" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// LOGIN USER
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data: users, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .limit(1);

    if (error || users.length === 0)
      return res.status(400).json({ error: "Invalid email" });

    const user = users[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(400).json({ error: "Incorrect password" });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    return res.json({
      message: "Login successful",
      token,
      role: user.role,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};