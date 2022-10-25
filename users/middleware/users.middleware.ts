import express from 'express';
import debug from 'debug';

import usersService from '../services/users.services'

const log: debug.IDebugger = debug('app:users-middleware');
/**
 * This will add validation to express js routes, to:
 * 1. ensure presence of user fields such as email and password as required to create / update
 * a user
 * 2. ensure a given email isn't in use already
 * 3. check that we're not changing the email field after creation, since that will be the 
 * Primary key
 * 4. validate wheter a give user exists
 */
class UsersMiddleware {
  async validateRequiredUserBodyFields(req: express.Request, res: express.Response, next: express.NextFunction) {
    if(req.body && req.body.email && req.body.password) {
      next();
    } else {
      res.status(400).send({ error:`Missing required fields email & password`});
    }
  }

  async validateSameEmailDoesntExist(req: express.Request, res: express.Response, next: express.NextFunction) {
    const user = await usersService.getUserByEmail(req.body.email);
    if(user) {
      res.status(400).send({ error:'User email already exists' });
    } else {
      next();
    }
  }

  async validateSameEmailBelongToSameUser(req: express.Request, res: express.Response, next: express.NextFunction) {
    const user = await usersService.getUserByEmail(req.body.email);
    if(user && user.id === req.params.userId) {
      next();
    } else {
      res.status(400).send({ error: 'Invalid email' });
    }
  }

  // Here we need to use an arrow fn to bind 'this' correctly
  validatePatchEmail = async(req: express.Request, res: express.Response, next: express.NextFunction) => {
    if(req.body.email) {
      log(`validating email ${req.body.email}`);
      this.validateSameEmailBelongToSameUser(req, res, next);
    } else {
      next();
    }
  }

  async validateUserExists(req: express.Request, res: express.Response, next: express.NextFunction) {
    const user = await usersService.readById(req.params.userId);
    if(user) {
      next();
    } else {
      res.status(404).send({ error:`user ${req.params.userId} notFound`});
    }
  }

  async extractUserId(req: express.Request, res: express.Response, next: express.NextFunction) {
    req.body.id = req.params.userId;
    next();
  }
}

export default new UsersMiddleware();
