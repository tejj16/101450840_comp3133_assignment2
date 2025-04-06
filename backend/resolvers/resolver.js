const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Employee = require("../models/Employee");

const resolvers = {
    Query: {

        
        getAllEmployees: async () => {
            try {
                const employees = await Employee.find();
                return employees;
            } catch (error) {
                throw new Error("Error fetching employees: " + error.message);
            }
        },

        
        getEmployeeById: async (_, { eid }) => {
            try {
                const employee = await Employee.findById(eid);
                if (!employee) throw new Error("Employee not found.");
                return employee;
            } catch (error) {
                throw new Error("Error fetching employee: " + error.message);
            }
        },

        
        searchEmployees: async (_, { designation, department }) => {
            try {
                const employees = await Employee.find({
                    $or: [{ designation }, { department }],
                });
                return employees;
            } catch (error) {
                throw new Error("Error searching employees: " + error.message);
            }
        },
    },

    Mutation: {
        
        signup: async (_, { username, email, password }) => {
            try {
                const existingUser = await User.findOne({ email });
                if (existingUser) {
                    throw new Error("Email already in use. Please login or use another email.");
                }

                const hashedPassword = await bcrypt.hash(password, 10);
                const newUser = new User({ username, email, password: hashedPassword });

                await newUser.save();
                return {
                    id: newUser.id,
                    username: newUser.username,
                    email: newUser.email,
                    message: "Signup successful! Please login.",
                };
            } catch (error) {
                throw new Error(error.message);
            }
        },

        
        login: async (_, { email, password }) => {
            try {
                const user = await User.findOne({ email });
                if (!user) {
                    throw new Error("User not found! Please sign up.");
                }

                const isMatch = await bcrypt.compare(password, user.password);
                if (!isMatch) {
                    throw new Error("Invalid credentials! Please try again.");
                }

                const token = jwt.sign(
                    { id: user.id, email: user.email, username: user.username },
                    "LOL",
                    { expiresIn: "1h" }
                );

                return {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    token,
                };
            } catch (error) {
                throw new Error(error.message);
            }
        },

        
        addEmployee: async (_, { input }) => {
            try {
                const newEmployee = new Employee(input);  
                await newEmployee.save();
                return newEmployee;
            } catch (error) {
                throw new Error("Error adding employee: " + error.message);
            }
        },

        
        updateEmployee: async (_, { eid, input }) => {
            try {
                const updatedEmployee = await Employee.findByIdAndUpdate(eid, { $set: input }, { new: true });
                return updatedEmployee;
            } catch (error) {
                throw new Error("Error updating employee: " + error.message);
            }
        },

        
        deleteEmployee: async (_, { eid }) => {
            try {
                await Employee.findByIdAndDelete(eid);
                return "Employee deleted successfully.";
            } catch (error) {
                throw new Error("Error deleting employee: " + error.message);
            }
        },
    },
};

module.exports = resolvers;
