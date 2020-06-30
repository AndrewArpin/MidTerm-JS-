// You need to define the schema for a reservation
// The fields you require are:
// associated user
// quantity of guests
// restaurant name
// date and time of reservation (you can do these as separate fields if you wish) 

const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
     user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      quantityOfGuests: {
        type: Number,
        required : false
      },
      restaurants: { 
          type: String,
          enum: ['Kelseys', 'Montanas', 'Outbacks', 'Harveys', 'Swiss Chalet'],
          default: 'Kelseys'
      },
      dateAndTime: {
          type: Date,      
          required: false  
      }
});

module.exports = mongoose.model('Reservation', ReservationSchema);