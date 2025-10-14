const { Stroller, Group, Field, Feature, StrollerFeatureValue, FeatureGroup } = require('../models');
const { Op } = require('sequelize');
const { sequelize } = require('../config/database');

// Create new stroller with groups and fields
exports.createStroller = async (req, res) => {
  try {
    const { modelName, alternativeModelNames, brand, imagePath, groups } = req.body;
    
    // Create stroller
    const stroller = await Stroller.create({
      modelName,
      alternativeModelNames,
      brand,
      imagePath
    });

    // Create groups and fields
    for (const groupData of groups) {
      const [group] = await Group.findOrCreate({
        where: {
          key: groupData.group.key,
          title: groupData.group.title
        }
      });

      await stroller.addStrollerGroup(group);

      // Create fields for this group
      for (const fieldData of groupData.fields) {
        const [field] = await Field.findOrCreate({
          where: {
            key: fieldData.key,
            title: fieldData.title,
            value: fieldData.value
          }
        });

        await group.addGroupField(field);
      }
    }

    // Return the created stroller with all its relations
    const createdStroller = await Stroller.findByPk(stroller.id, {
      include: [{
        model: Group,
        as: 'strollerGroups',
        include: [{
          model: Field,
          as: 'groupFields'
        }]
      }]
    });

    res.status(201).json(createdStroller);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Search strollers by name, brand, or alternative names
exports.searchStrollers = async (req, res) => {
  try {
    console.log('Starting search function...'); // Initial log
    
    const { query } = req.query;
    console.log('Received query:', query); // Log the query parameter
    
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    // Search across all three fields
    const strollers = await Stroller.findAll({
      where: {
        [Op.or]: [
          { modelName: { [Op.like]: `%${query}%` } },
          { brand: { [Op.like]: `%${query}%` } },
          where(cast(col('alternativeModelNames'), 'TEXT'), { [Op.iLike]: `%${query}%` })
        ]
      },
      attributes: ['strollerId', 'modelName', 'brand']
    });

    console.log('Found strollers:', strollers);
    res.json(strollers);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ 
      message: 'Error searching strollers',
      error: error.message
    });
  }
};

// Get detailed stroller data for comparison
exports.getStrollersForComparison = async (req, res) => {
  try {
    console.log('Comparison request received:', req.query);
    const { ids } = req.query;
    if (!ids) {
      console.log('No IDs provided in request');
      return res.status(400).json({ message: 'Stroller IDs are required' });
    }

    const strollerIds = ids.split(',').map(id => parseInt(id));
    console.log('Looking for strollers with IDs:', strollerIds);

    const strollers = await Stroller.findAll({
      where: {
        strollerId: strollerIds
      },
      include: [{
        model: StrollerFeatureValue,
        as: 'StrollerFeatureValues',
        include: [{
          model: Feature,
          as: 'Feature',
          include: [{
            model: FeatureGroup,
            as: 'groupFields',
            attributes: ['featureGroupId', 'title', 'key']
          }]
        }]
      }]
    });

    console.log('Found strollers:', strollers.length);
    console.log('First stroller data:', JSON.stringify(strollers[0], null, 2));

    // Format the response according to the frontend type
    const formattedStrollers = strollers.map(stroller => {
      // Group features by their feature group
      const groupedFeatures = {};
      stroller.StrollerFeatureValues.forEach(sfv => {
        const feature = sfv.Feature;
        const group = feature.groupFields;
        
        if (!groupedFeatures[group.featureGroupId]) {
          groupedFeatures[group.featureGroupId] = {
            group: {
              key: group.featureGroupId.toString(),
              title: group.title
            },
            fields: []
          };
        }
        
        groupedFeatures[group.featureGroupId].fields.push({
          key: feature.featureId.toString(),
          title: feature.title,
          value: sfv.value
        });
      });

      return {
        strollerId: stroller.strollerId,
        modelName: stroller.modelName,
        modelDescription: stroller.modelDescription,
        alternativeModelNames: stroller.alternativeModelNames,
        brand: stroller.brand,
        imagePath: stroller.imagePath,
        groups: Object.values(groupedFeatures)
      };
    });

    console.log('Sending formatted response with', formattedStrollers.length, 'strollers');
    res.json(formattedStrollers);
  } catch (error) {
    console.error('Error in getStrollersForComparison:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      message: 'Error fetching stroller data',
      error: error.message
    });
  }
}; 