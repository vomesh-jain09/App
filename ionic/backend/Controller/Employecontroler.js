const Employee = require('../model/Employee');


exports .GetEmploye=async (req, res) => {
    const employees = await Employee.find();
    res.json(employees);
  }

  exports.postEmploye=async (req, res) => {
    try {
      const { name, position } = req.body;
      const newEmployee = new Employee({ name, position });
      await newEmployee.save();
      res.status(201).json(newEmployee);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
  exports.updateEmployee=async (req, res) => {
    try {
      const { name, position } = req.body;
      const updated = await Employee.findByIdAndUpdate(
        req.params.id,
        { name, position },
        { new: true }
      );
      if (!updated) {
        return res.status(404).json({ message: 'Employee not found' });
      }
      res.json(updated);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
  exports.deleteEmployee = async (req, res) => {
    try {
      const deleted = await Employee.findByIdAndDelete(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: 'Employee not found' });
      }
      res.status(200).json({ message: "Deleted successfully" }); // 👍 message will show
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };
  