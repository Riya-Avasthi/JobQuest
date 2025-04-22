import mongoose from 'mongoose';

// Add operation logging to all mongoose operations
const setupMongooseInterceptors = () => {
  // Save original methods
  const originalSave = mongoose.Model.prototype.save;
  const originalFindOne = mongoose.Model.findOne;
  const originalFind = mongoose.Model.find;
  const originalCreate = mongoose.Model.create;
  
  // Intercept save operations
  mongoose.Model.prototype.save = function(options) {
    console.log(`[MongoDB] Saving document to ${this.constructor.modelName}:`, this._id || 'new document');
    return originalSave.call(this, options)
      .then(result => {
        console.log(`[MongoDB] Successfully saved document to ${this.constructor.modelName}`);
        return result;
      })
      .catch(err => {
        console.error(`[MongoDB] Error saving document to ${this.constructor.modelName}:`, err.message);
        throw err;
      });
  };
  
  // Intercept findOne operations
  mongoose.Model.findOne = function() {
    console.log(`[MongoDB] Finding document in ${this.modelName}`);
    return originalFindOne.apply(this, arguments)
      .then(result => {
        console.log(`[MongoDB] Find result for ${this.modelName}:`, result ? 'document found' : 'not found');
        return result;
      })
      .catch(err => {
        console.error(`[MongoDB] Error finding document in ${this.modelName}:`, err.message);
        throw err;
      });
  };
  
  // Intercept find operations
  mongoose.Model.find = function() {
    console.log(`[MongoDB] Finding documents in ${this.modelName}`);
    return originalFind.apply(this, arguments)
      .then(result => {
        console.log(`[MongoDB] Found ${result.length} documents in ${this.modelName}`);
        return result;
      })
      .catch(err => {
        console.error(`[MongoDB] Error finding documents in ${this.modelName}:`, err.message);
        throw err;
      });
  };
  
  // Intercept create operations
  mongoose.Model.create = function() {
    console.log(`[MongoDB] Creating document in ${this.modelName}`);
    return originalCreate.apply(this, arguments)
      .then(result => {
        console.log(`[MongoDB] Successfully created document in ${this.modelName}`);
        return result;
      })
      .catch(err => {
        console.error(`[MongoDB] Error creating document in ${this.modelName}:`, err.message);
        throw err;
      });
  };
  
  console.log('[MongoDB] Mongoose interceptors activated');
};

export default setupMongooseInterceptors; 