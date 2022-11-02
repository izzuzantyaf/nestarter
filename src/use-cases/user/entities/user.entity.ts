import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {
  isEmail,
  isEmpty,
  isMongoId,
  isNotEmpty,
  isNotEmptyObject,
  isObject,
  isString,
  maxLength,
  minLength,
} from 'class-validator';
import { ApiHideProperty } from '@nestjs/swagger';

export type UserDocument = User & Document;

export type UserConstructorProps = Partial<
  Pick<
    User,
    '_id' | 'id' | 'name' | 'email' | 'password' | 'created_at' | 'updated_at'
  >
>;

@Schema({ timestamps: true })
export class User {
  id?: number | string; // id or general database identifier
  _id?: string; // id for MongoDB database
  @Prop({ required: true })
  name: string;
  @Exclude()
  @Prop({ required: true, unique: true })
  email: string;
  @ApiHideProperty()
  @Prop({ required: true })
  password: string;
  readonly created_at?: Date | string;
  readonly updated_at?: Date | string;

  constructor(props?: UserConstructorProps) {
    const { _id, id, name, email, password, created_at, updated_at } = props;
    if (isMongoId(id)) {
      this._id = id as string;
      this.id = id;
    } else {
      this.id = id;
    }
    if (isNotEmpty(_id)) {
      this._id = _id;
      this.id = _id;
    }
    this.name = name;
    this.email = email;
    this.password = password;
    this.created_at = created_at ? new Date(created_at) : undefined;
    this.updated_at = updated_at ? new Date(updated_at) : undefined;
  }

  /**
   * Determine name property is satisfy the validation rule or not
   * @returns True if name property is satisfy the validation rule
   */
  protected validateName() {
    const maxNameLength = 100;
    if (!isString(this.name)) return { name: 'Nama harus bertipe string' };
    if (isEmpty(this.name)) return { name: 'Nama harus diisi' };
    if (!maxLength(this.name, maxNameLength))
      return { name: `Nama maksimal ${maxNameLength} karakter` };
    return true;
  }

  /**
   * Determine email property is satisfy the validation rule or not
   * @returns True if email property is satisfy the validation rule
   */
  protected validateEmail() {
    if (!isString(this.email)) return { email: 'Email harus bertipe string' };
    if (isEmpty(this.email)) return { email: 'Email harus diisi' };
    if (!isEmail(this.email)) return { email: 'Email tidak valid' };
    return true;
  }

  /**
   * Determine password property is satisfy the validation rule or not
   * @returns True if password property is satisfy the validation rule
   */
  protected validatePassword() {
    const minPasswordLength = 6;
    if (!isString(this.password))
      return { password: 'Password harus bertipe string' };
    if (isEmpty(this.password)) return { password: 'Password harus diisi' };
    if (!minLength(this.password, minPasswordLength))
      return { password: `Password minimal ${minPasswordLength} karakter` };
    return true;
  }

  /**
   * Do validation to all properties against the validation rules
   * @returns True if all properties are satisfy the validation rules
   */
  validateProps() {
    const validationResults = [
      this.validateName(),
      this.validateEmail(),
      this.validatePassword(),
    ];
    const errors = validationResults.reduce(
      (error, result) => (isObject(result) ? { ...error, ...result } : error),
      {},
    );
    return isNotEmptyObject(errors) ? errors : null;
  }

  /**
   * Hash the user password
   * @returns hashed password string
   */
  async hashPassword() {
    const saltOrRounds = 10;
    this.password = await bcrypt.hash(this.password, saltOrRounds);
    return this.password;
  }

  /**
   * Compare user password against user password in the database
   * @param passwordToBeVerified Plain text password intended to be verified
   * @returns True if plain text password is matched
   */
  async verifyPassword(passwordToBeVerified: string) {
    return await bcrypt.compare(passwordToBeVerified, this.password);
  }
}

export const UserSchema = SchemaFactory.createForClass(User);
