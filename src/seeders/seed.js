const { Stroller, Feature, StrollerFeatureValue, FeatureGroup } = require('../models');

const seedDatabase = async () => {
  try {
    // Clear existing data
    await StrollerFeatureValue.destroy({ where: {} });
    await Feature.destroy({ where: {} });
    await FeatureGroup.destroy({ where: {} });
    await Stroller.truncate({ cascade: true, restartIdentity: true });

    // Create feature groups
    const featureGroups = await FeatureGroup.bulkCreate([
      { featureGroupId: 1, key: 'basics', title: 'Basic Information'},
      { featureGroupId: 2, key: 'dimensions', title: 'Dimensions & Weight'},
      { featureGroupId: 3, key: 'seat', title: 'Seat Features' },
      { featureGroupId: 4, key: 'safety', title: 'Safety & Comfort0'},
      { featureGroupId: 5, key: 'storage', title: 'Storage & Accessories' }
    ]);

    // Create features
    const features = await Feature.bulkCreate([
      // Basic Information
      { featureId: 1, key: 'countryOfOrigin', title: 'Country of Origin', featureGroupId: 1 },
      { featureId: 2, key: 'materials', title: 'Materials', featureGroupId: 1 },
      
      // Dimensions & Weight
      { featureId: 3, key: 'weight', title: 'Weight', featureGroupId: 2 },
      { featureId: 4, key: 'dimensions', title: 'Dimensions', featureGroupId: 2 },
      { featureId: 5, key: 'wheelType', title: 'Wheel Type', featureGroupId: 2 },
      { featureId: 6, key: 'foldType', title: 'Fold Type', featureGroupId: 2 },
      
      // Seat Features
      { featureId: 7, key: 'seatRecline', title: 'Seat Recline', featureGroupId: 3 },
      { featureId: 8, key: 'seatOrientation', title: 'Seat Orientation', featureGroupId: 3 },
      { featureId: 9, key: 'handlebarHeight', title: 'Handlebar Height', featureGroupId: 3 },
      
      // Safety & Comfort
      { featureId: 10, key: 'safetyFeatures', title: 'Safety Features', featureGroupId: 4 },
      { featureId: 11, key: 'canopy', title: 'Canopy', featureGroupId: 4 },
      
      // Storage & Accessories
      { featureId: 12, key: 'storageCapacity', title: 'Storage Capacity', featureGroupId: 5 },
      { featureId: 13, key: 'basket', title: 'Basket', featureGroupId: 5 },
      { featureId: 14, key: 'accessories', title: 'Accessories', featureGroupId: 5 }
    ]);

    // Create strollers
    const strollers = await Stroller.bulkCreate([
      {
        modelName: 'Dragonfly',
        alternativeModelNames: ['Dragonfly 2.0'],
        brand: 'Bugaboo',
        imagePath: '/images/dragonfly.jpg',
        modelDescription: ""
      },
      {
        modelName: 'Yoyo2',
        alternativeModelNames: ['Yoyo'],
        brand: 'Babyzen',
        imagePath: '/images/yoyo2.jpg',
        modelDescription: ""
      }
    ]);

    // Create stroller features
    const strollerFeatureValue = [
      // Dragonfly features
      { strollerId: 1, featureId: 1, value: 'Netherlands' },
      { strollerId: 1, featureId: 2, value: 'Aluminum frame, Textile' },
      { strollerId: 1, featureId: 3, value: '9.8 kg' },
      { strollerId: 1, featureId: 4, value: '85 x 60 x 100 cm' },
      { strollerId: 1, featureId: 5, value: 'All-wheel suspension' },
      { strollerId: 1, featureId: 6, value: 'One-hand fold' },
      { strollerId: 1, featureId: 7, value: 'Multiple positions' },
      { strollerId: 1, featureId: 8, value: 'Forward and parent facing' },
      { strollerId: 1, featureId: 9, value: 'Adjustable' },
      { strollerId: 1, featureId: 10, value: '5-point harness, All-wheel suspension' },
      { strollerId: 1, featureId: 11, value: 'Large UPF50+ canopy' },
      { strollerId: 1, featureId: 12, value: 'Large storage basket' },
      { strollerId: 1, featureId: 13, value: 'Large storage basket' },
      { strollerId: 1, featureId: 14, value: 'Cup holder, Organizer' },

      // Yoyo2 features
      { strollerId: 2, featureId: 1, value: 'France' },
      { strollerId: 2, featureId: 2, value: 'Aluminum frame, Textile' },
      { strollerId: 2, featureId: 3, value: '6.2 kg' },
      { strollerId: 2, featureId: 4, value: '52 x 44 x 18 cm (folded)' },
      { strollerId: 2, featureId: 5, value: 'All-wheel suspension' },
      { strollerId: 2, featureId: 6, value: 'One-hand fold' },
      { strollerId: 2, featureId: 7, value: 'Multiple positions' },
      { strollerId: 2, featureId: 8, value: 'Forward facing only' },
      { strollerId: 2, featureId: 9, value: 'Fixed' },
      { strollerId: 2, featureId: 10, value: '5-point harness' },
      { strollerId: 2, featureId: 11, value: 'Small canopy' },
      { strollerId: 2, featureId: 12, value: 'Small storage basket' },
      { strollerId: 2, featureId: 13, value: 'Small storage basket' },
      { strollerId: 2, featureId: 14, value: 'Cup holder' }
    ];

    await StrollerFeatureValue.bulkCreate(strollerFeatureValue);

    // Create associations between strollers and feature groups
    for (const stroller of strollers) {
      // Each stroller should be associated with all feature groups
      await stroller.setStrollerGroups(featureGroups);
    }

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

module.exports = seedDatabase; 