
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs'; 


const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['operator', 'supervisor', 'manager'], // Enum for predefined roles
    default: 'operator', // Default role
  },
});

// Hash the password before saving the user
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10); // Generate salt
  this.password = await bcrypt.hash(this.password, salt); // Hash the password
  next();
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
