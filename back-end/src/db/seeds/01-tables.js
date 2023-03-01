exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("tables")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("tables").insert([
        { table_name: "Bar #1", capacity: 1 },
        { table_name: "Bar #2", capacity: 2 },
        { table_name: "#1", capacity: 8 },
        { table_name: "#2", capacity: 4 },
        { table_name: "#3", capacity: 6 },
        { table_name: "#4", capacity: 4 },
        { table_name: "#5", capacity: 2 }
      ]);
    });
};
