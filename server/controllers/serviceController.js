const { getStore } = require('../services/dataStore');

exports.getCategories = async (req, res) => {
  try {
    const { isDb, ServiceCategory, Service, mem } = getStore();

    if (isDb) {
      const categories = await ServiceCategory.find().lean();
      for (const cat of categories) {
        cat.serviceCount = await Service.countDocuments({ categoryId: cat._id });
      }
      return res.json({ success: true, categories });
    } else {
      const categories = mem.categories.map(cat => {
        const count = mem.services.filter(s => s.categoryId.toString() === cat._id.toString()).length;
        return { ...cat, serviceCount: count };
      });
      return res.json({ success: true, categories });
    }
  } catch (error) {
    console.error('getCategories error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch categories.' });
  }
};

exports.getCategoryBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const { isDb, ServiceCategory, Service, mem } = getStore();

    if (isDb) {
      const category = await ServiceCategory.findOne({ slug });
      if (!category) {
        return res.status(404).json({ success: false, message: 'Category not found.' });
      }
      const services = await Service.find({ categoryId: category._id });
      return res.json({ success: true, category, services });
    } else {
      const category = mem.categories.find(c => c.slug === slug);
      if (!category) {
        return res.status(404).json({ success: false, message: 'Category not found.' });
      }
      const services = mem.services.filter(s => s.categoryId.toString() === category._id.toString());
      return res.json({ success: true, category, services });
    }
  } catch (error) {
    console.error('getCategoryBySlug error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch category.' });
  }
};

exports.getAllServices = async (req, res) => {
  try {
    const { search, categoryId } = req.query;
    const { isDb, Service, ServiceCategory, mem } = getStore();

    if (isDb) {
      let query = {};
      if (categoryId) query.categoryId = categoryId;
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { titleTa: { $regex: search, $options: 'i' } }
        ];
      }
      const services = await Service.find(query).populate('categoryId', 'name nameTa icon slug');
      return res.json({ success: true, services });
    } else {
      let services = mem.services;
      if (categoryId) {
        services = services.filter(s => s.categoryId.toString() === categoryId.toString());
      }
      if (search) {
        const q = search.toLowerCase();
        services = services.filter(s => 
          s.title.toLowerCase().includes(q) || 
          s.description.toLowerCase().includes(q) ||
          (s.titleTa && s.titleTa.includes(q))
        );
      }
      // enrich with category details
      const enriched = services.map(s => {
        const cat = mem.categories.find(c => c._id.toString() === s.categoryId.toString());
        return {
          ...s,
          categoryId: cat ? { _id: cat._id, name: cat.name, nameTa: cat.nameTa, icon: cat.icon, slug: cat.slug } : s.categoryId
        };
      });
      return res.json({ success: true, services: enriched });
    }
  } catch (error) {
    console.error('getAllServices error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch services.' });
  }
};

exports.getServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const { isDb, Service, ServiceCategory, mem } = getStore();

    if (isDb) {
      const service = await Service.findById(id).populate('categoryId');
      if (!service) return res.status(404).json({ success: false, message: 'Service not found.' });
      return res.json({ success: true, service });
    } else {
      const service = mem.services.find(s => s._id.toString() === id.toString());
      if (!service) return res.status(404).json({ success: false, message: 'Service not found.' });
      const cat = mem.categories.find(c => c._id.toString() === service.categoryId.toString());
      return res.json({
        success: true,
        service: {
          ...service,
          categoryId: cat || service.categoryId
        }
      });
    }
  } catch (error) {
    console.error('getServiceById error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch service.' });
  }
};
