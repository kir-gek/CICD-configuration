const { DogBreed } = require("../models/models");
const ApiError = require("../error/ApiError");

class DogController {
   async getTest(req, res, next) {
    try {
      const breedAll = await DogBreed.findAll({
        order: [ ["id", "ASC"]],
      });
      return res.json(breedAll);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async getBreed(req, res, next) {
    try {
      const breedAll = await DogBreed.findAll({
        order: [ ["id", "ASC"]],
      });
      return res.json(breedAll);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async postBreed(req, res, next) {
    try {
      const { title, description } = req.body;
      const breed= await DogBreed.create({ title, description });
      return res.json(breed);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async updateBreed(req, res, next) {
    try {
      const { id, title, description } = req.body;
      await DogBreed.update({ title, description }, { where: { id } });
      const breedUpdated = await DogBreed.findAll({ where: { id } });
      return res.json(breedUpdated[0]);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async deleteBreed(req, res, next) {
    try {
      const id = req.params.id;
      await DogBreed.destroy({
        where: { id },
      });
      return res.json("ok");
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }
}

module.exports = new DogController();
