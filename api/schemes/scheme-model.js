const db = require("../../data/db-config");

async function find() {
  // EXERCISE A
  /*
    1A- Study the SQL query below running it in SQLite Studio against `data/schemes.db3`.
    What happens if we change from a LEFT join to an INNER join?
    If we change left join to inner join, any scheme with zero steps has no represention in the sql response.

  */

  return await db("schemes as sc")
    .leftJoin("steps as st", "sc.scheme_id", "st.scheme_id")
    .groupBy("sc.scheme_id")
    .select("sc.scheme_id", "scheme_name")
    .count("st.step_id as number_of_steps");
}

async function findById(scheme_id) {
  const stepsArr = await db("schemes as sc")
    .leftJoin("steps as st", "sc.scheme_id", "st.scheme_id")
    .select("sc.*", "st.step_id", "st.step_number", "st.instructions")
    .where("sc.scheme_id", scheme_id || 0)
    .orderBy("st.step_number");

  return {
    scheme_id: stepsArr[0].scheme_id,
    scheme_name: stepsArr[0].scheme_name,
    steps:
      stepsArr.length === 1
        ? []
        : stepsArr.map((step) => {
            return {
              step_id: step.step_id,
              step_number: step.step_number,
              instructions: step.instructions,
            };
          }),
  };
}

async function findSteps(scheme_id) {
  const stepsArr = await db("schemes as sc")
    .leftJoin("steps as st", "sc.scheme_id", "st.scheme_id")
    .where("sc.scheme_id", scheme_id)
    .select("sc.scheme_name", "st.step_id", "st.step_number", "st.instructions")
    .orderBy("st.step_number");

  return stepsArr;

  // EXERCISE C
  /*
    1C- Build a query in Knex that returns the following data.
    The steps should be sorted by step_number, and the array
    should be empty if there are no steps for the scheme:

      [
        {
          "step_id": 5,
          "step_number": 1,
          "instructions": "collect all the sheep in Scotland",
          "scheme_name": "Get Rich Quick"
        },
        {
          "step_id": 4,
          "step_number": 2,
          "instructions": "profit",
          "scheme_name": "Get Rich Quick"
        }
      ]
  */
}

async function add(scheme) {
  const [newSchemeId] = await db("schemes").insert(scheme);

  return findById(newSchemeId);
}

async function addStep(scheme_id, step) {
  step.scheme_id = scheme_id;

  await db("steps").insert(step);

  return findSteps(scheme_id);

  // EXERCISE E
  /*
    1E- This function adds a step to the scheme with the given `scheme_id`
    and resolves to _all the steps_ belonging to the given `scheme_id`,
    including the newly created one.
  */
}

module.exports = {
  find,
  findById,
  findSteps,
  add,
  addStep,
};
