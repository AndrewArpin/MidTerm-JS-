// You need to complete this controller with the required 7 actions
const viewPath = 'reservations';
const User = require('../models/user');
const Reservation = require('../models/reservation');

exports.index = async (req, res) => {
    try{ 
       const reservations = await Reservation
       .find()
       .populate('user')
       .sort({updatedAt: 'desc'});         
       const restaurants = Reservation.schema.paths.restaurants.enumValues;
       res.render(`${viewPath}`, {
        pageTitle: 'Reservations',
        reservations: reservations,
        restaurants: restaurants
       });
    } catch (error){
        req.flash('danger',`There was an issue displaying the reservations: ${error}`);
        res.redirect('/');
    }
};

exports.show = async (req, res) => {
    try {
        const reservations = await Reservation.findById(req.params.id)
        .populate('user');
        res.render(`${viewPath}/show`, {
            pageTitle: 'Reservation Information',
            reservation: reservations
        });
    } catch (error){
        req.flash('danger', `There was an error displaying this reservation: ${error}`);
        res.redirect('/');
    }
};
exports.new = (req, res) => {
    const restaurants = Reservation.schema.paths.restaurants.enumValues;
    res.render(`${viewPath}/new`, {
      pageTitle: 'New Reservation',
      restaurants: restaurants
    });
  };

  exports.create = async (req, res) => {
    try{
      const {user: email} = req.session.passport;
      const user = await User.findOne({email: email});
      const reservation = await Reservation.create({user: user._id, ...req.body});

      req.flash('success','Your reservation has been created');
      res.redirect(`/reservations/${reservation.id}`);
  } catch (error){
        req.flash('danger',`There was an issue displaying this reservation: ${error}`);
        res.redirect('/');
  }
}

exports.edit = async (req, res) => {
    try {
        const reservations = await Reservation.findById(req.params.id);
        const restaurants = Reservation.schema.paths.restaurants.enumValues;
        res.render(`${viewPath}/edit`,{
            pageTitle: 'Reservation Information',
            reservations: reservations,
            restaurants: restaurants
        });
    }catch (error){
        req.flash('danger', `There was an error displaying this reservation: ${error}`);
        res.redirect('/');
    }    
};

exports.update = async (req, res) => {
    try {
        const { user: email } = req.session.passport;
        const user = await User.findOne({email: email});

        let res = await Reservation.findById(req.body.id);
        if (!res) throw new Error('Reservation could not be found');

        const info = {user: user._id, ...req.body};
        await Reservation.validate(info);
        await Reservation.findByIdAndUpdate(info.id, info);

        req.flash('success', 'Reservation was updated');
        res.redirect(`/reservations/${req.body.id}`);
    } catch (error) {
        req.flash('danger', `There was an issue updating your reservation: ${error}`);
        res.redirect(`/reservations/${req.body.id}`);
    }
};

exports.delete = async (req, res) => {
    try {
        await Reservation.deleteOne({_id: req.body.id});
        req.flash('success','Reservation was deleted');
        res.redirect('/reservations');
    } catch (error) { 
        req.flash('danger', `There was an issue deleting this reservation: ${error}`);
        res.redirect('/reservations');
    }
};