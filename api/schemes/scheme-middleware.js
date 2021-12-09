/*
  If `scheme_id` does not exist in the database:

  status 404
  {
    "message": "scheme with scheme_id <actual id> not found"
  }
*/
const db = require("../../data/db-config");

const checkSchemeId = async (req, res, next) => {
  const existing = await db("schemes")
    .where("scheme_id", req.params.scheme_id)
    .first();

  if (existing) next();
  else
    next({
      status: 404,
      message: `scheme with scheme_id ${req.params.scheme_id} not found`,
    });
};

/*
  If `scheme_name` is missing, empty string or not a string:

  status 400
  {
    "message": "invalid scheme_name"
  }
*/
const validateScheme = (req, res, next) => {
  const { scheme_name } = req.body;

  if (!scheme_name || typeof scheme_name !== "string" || !scheme_name.trim()) {
    next({ message: "invalid scheme_name", status: 400 });
  } else next();
};
/*
  If `instructions` is missing, empty string or not a string, or
  if `step_number` is not a number or is smaller than one:

  status 400
  {
    "message": "invalid step"
  }
*/
const validateStep = (req, res, next) => {
  const { step_number, instructions } = req.body;

  if (
    !instructions ||
    instructions === "" ||
    typeof instructions !== "string" ||
    typeof step_number !== "number" ||
    step_number < 1
  ) {
    next({ message: "invalid step", status: 400 });
  } else next();
};

module.exports = {
  checkSchemeId,
  validateScheme,
  validateStep,
};
