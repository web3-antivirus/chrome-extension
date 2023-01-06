import { exec } from 'child_process';

import * as uuid from 'uuid';
import _ from 'lodash';


import { Defer } from './defer';

export class SharedHelper {

  /**
   * Returns the stack trace of current logic.
   *
   * @return {string}
   */
  static get stack(): string {
    return _.replace(new Error().stack ?? '', /Error\n[^\n]*/, '');
  }

  /**
   * Generates a UUID v4.
   * {@link https://www.npmjs.com/package/uuid}
   *
   * @param  {string} removeDash
   * @return {string}
   */
  static generateUUID(removeDash = false): string {
    const newUUID = uuid.v4();
    if (removeDash === true) {
      return _.replace(newUUID, /-/g, '');
    }
    return newUUID;
  }

  /**
   * Executes the provied command.
   *
   * @param  {string} cmd
   * @return {Promise<string>}
   */
  static execShell(cmd: string): Promise<string> {
    const defer: Defer<string> = Defer.create();

    exec(cmd, (error, stdout, stderr) => {

      if (_.isNil(error) === false) {
        return defer.reject(`${stdout}\n${error}`);
      }

      if (_.isNil(stdout) === false) {
        return defer.resolve(stdout);
      }

      if (_.isNil(stderr) === false) {
        return defer.reject(stderr);
      }
    });

    return defer.wait();
  }

  /**
   * Creates stop-promise which will be resolved in the specific interval.
   *
   * @param  {number} waitFor
   * @return {Promise<void>}
   */
  static async waitTimer(waitFor: number): Promise<void> {
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(null);
      }, waitFor || 0);
    });
  }

  /**
   * Extracts the id from entity. If `key` is exists, method will extract `id` field from `key`
   * property.
   *
   * @param  {any|number} entityOrId
   * @param  {string} [key]
   * @return {IdType}
   */
  static getEntityId<IdType = number>(entityOrId: any | number, key?: string): IdType {
    const entityKey = !_.isString(key) || key === '' ? 'id' : key;
    const entityId = _.get(entityOrId, entityKey, entityOrId);
    return entityId;
  }

  /**
   * Extracts the id from entities and return the list of ids. If `key` is exists, method will
   * extract `id` field from `key` property.
   *
   * @param  {any|number} entityOrId
   * @param  {string} [key]
   * @return {IdType}
   */
  static getEntityIds<IdType = number>(entitiesOrIds: (any | number)[], key?: string): IdType[] {
    const arrOfEnitiesOrIds = SharedHelper.ensureArray(entitiesOrIds);
    const entityIds = _.map(arrOfEnitiesOrIds, (entityOrId) => {
      return SharedHelper.getEntityId<IdType>(entityOrId, key);
    });
    return entityIds;
  }

  /**
   * Transforms the first argument to an array if it's not an array.
   *
   * @param  {T|T[]} entities
   * @return {T[]}
   */
  static ensureArray<T>(entities: T | T[]): T[] {
    const arrOfEnities = _.isArray(entities) ? entities : [entities];
    return arrOfEnities;
  }

  /**
   * Returns capitalized representation of string.
   *
   * @param  {string} str
   * @return {string}
   */
  static capitalizeString(str: string): string {
    const capitalizedString = str.charAt(0).toUpperCase() + str.slice(1);
    return capitalizedString;
  }

  /**
   * Returns parsed JSON value if possible or null otherwise.
   *
   * @param {string} jsonValue
   * @return {T}
   */
  static safeJsonParse<T = any>(jsonValue: string): T {
    let result;
    try {
      result = JSON.parse(jsonValue);
    } catch (error) {
      result = null;
    }

    return result;
  }

  /**
   * Returns random integer.
   *
   * @param  {number} min
   * @param  {number} max
   * @return {number}
   */
  static getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min)) + min;
  }
}
