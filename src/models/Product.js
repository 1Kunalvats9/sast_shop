import mongoose from 'mongoose';

const VariantSchema = new mongoose.Schema({
  size: {
    type: String,
    required: function() { return this.parent().hasVariants; }
  },
  color: {
    type: String,
    required: function() { return this.parent().hasVariants; }
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  available: {
    type: Boolean,
    default: true
  }
});

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  image: {
    type: String,
    required: true
  },
  images: [{
    type: String,
    trim: true
  }],
  category: {
    type: String,
    required: true
  },
  stock: {
    type: Number,
    required: function() { return !this.hasVariants; },
    min: 0,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  hasVariants: {
    type: Boolean,
    default: false
  },
  variants: [VariantSchema],
  availableSizes: [{
    type: String,
    trim: true
  }],
  availableColors: [{
    type: String,
    trim: true
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

ProductSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual to get total stock for variant products
ProductSchema.virtual('totalStock').get(function() {
  if (this.hasVariants) {
    return this.variants.reduce((total, variant) => {
      return variant.available ? total + variant.stock : total;
    }, 0);
  }
  return this.stock;
});

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);