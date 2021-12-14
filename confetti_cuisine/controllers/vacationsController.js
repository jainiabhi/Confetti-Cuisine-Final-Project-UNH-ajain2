"use strict";

const vacation = require("../models/vacation"),
  httpStatus = require("http-status-codes"),
  getVacationParams = body => {
    return {
        title: body.title,
        description: body.description,
        heroImage: body.heroImage,
        cuisine: body.cuisine,
        cost: body.cost,
        maxTravelers: body.maxTravelers,
        destination: body.destination,
        departureLocation: body.departureLocation,
        departureDate: body.departureDate,
        returnDate: body.returnDate
    };
  };

module.exports = {
  index: (req, res, next) => {
    vacation.find()
      .then(vacations => {
        res.locals.vacations = vacations;
        next();
      })
      .catch(error => {
        console.log(`Error fetching vacations: ${error.message}`);
        next(error);
      });
  },

  indexView: (req, res) => {
    res.render("vacations/index");
  },

  new: (req, res) => {
    res.render("vacations/new");
  },

  create: (req, res, next) => {
    let vacationParams = getVacationParams(req.body);

    req.check('departureDate', 'Departure date cannot be less than today\'s date.').isAfter(new Date().toString());
    req.check('returnDate', 'Return date cannot be less than today\'s date.').isAfter(new Date().toString());
    req.check('departureDate', 'Return date should be greater than departure date.').isBefore(req.body.returnDate);

    req.getValidationResult().then(errors => {
        if (!errors.isEmpty()) {
            let error = errors.array()[0];
            req.flash("error", error.msg);
            res.locals.redirect = "/vacations/new";
            next();
        } else {
            vacation.create(vacationParams)
            .then(vacation => {
                res.locals.redirect = "/vacations";
                res.locals.vacation = vacation;
                req.flash("success", `${vacation.title} Vacation is created successfully.`);
                next();
            })
            .catch(error => {
                console.log(`Error saving vacation: ${error.message}`);
                next(error);
            });
        }
    });
  },

  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath !== undefined) res.redirect(redirectPath);
    else next();
  },

  show: (req, res, next) => {
    let vacationId = req.params.id;
    vacation.findById(vacationId)
      .then(vacation => {
        res.locals.vacation = vacation;
        next();
      })
      .catch(error => {
        console.log(`Error fetching vacation by ID: ${error.message}`);
        next(error);
      });
  },

  showView: (req, res) => {
    res.render("vacations/show");
  },

  edit: (req, res, next) => {
    let vacationId = req.params.id;
    vacation.findById(vacationId)
      .then(vacation => {
        res.render("vacations/edit", {
          vacation: vacation
        });
      })
      .catch(error => {
        console.log(`Error fetching vacation by ID: ${error.message}`);
        next(error);
      });
  },

  update: (req, res, next) => {
    let vacationId = req.params.id,
      vacationParams = getVacationParams(req.body);

    req.check('departureDate', 'Departure date cannot be less than today\'s date.').isAfter(new Date().toString());
    req.check('returnDate', 'Return date cannot be less than today\'s date.').isAfter(new Date().toString());
    req.check('departureDate', 'Return date should be greater than departure date.').isBefore(req.body.returnDate);

    req.getValidationResult().then(errors => {
        if (!errors.isEmpty()) {
            let error = errors.array()[0];
            req.flash("error", error.msg);
            res.locals.redirect = `/vacations/${vacationId}/edit`;
            next();
        } else {
            vacation.findByIdAndUpdate(vacationId, {
                $set: vacationParams
            })
            .then(vacation => {
                res.locals.redirect = `/vacations/${vacationId}`;
                res.locals.vacation = vacation;
                req.flash("success", `${vacation.title} Vacation is updated successfully.`);
                next();
            })
            .catch(error => {
                console.log(`Error updating vacation by ID: ${error.message}`);
                next(error);
            });
        }
    });

  },

  delete: (req, res, next) => {
    let vacationId = req.params.id;
    vacation.findByIdAndRemove(vacationId)
      .then(() => {
        res.locals.redirect = "/vacations";
        req.flash("success", `Vacation is deleted successfully.`);
        next();
      })
      .catch(error => {
        console.log(`Error deleting vacation by ID: ${error.message}`);
        next();
      });
  },

  respondJSON: (req, res) => {
    res.json({
      status: httpStatus.OK,
      data: res.locals
    });
  },

  errorJSON: (error, req, res, next) => {
    let errorObject;
    if (error) {
      errorObject = {
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: error.message
      };
    } else {
      errorObject = {
        status: httpStatus.OK,
        message: "Unknown Error."
      };
    }
    res.json(errorObject);
  }
};
