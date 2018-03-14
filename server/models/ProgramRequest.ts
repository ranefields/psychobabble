import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable } from "typeorm";
import { SoftSkill } from "./SoftSkill";
import { User } from "./User";

/** Represents a request by a client for a new Program to be created */
@Entity('program_requests')
export class ProgramRequest {
  /** Autogenerated id as a UUID string. */
  @PrimaryGeneratedColumn("uuid")
  id: string;

  /** Text describing the requested Program. Nullable. */
  @Column({nullable: true})
  text: string;

  /** Creation Date */
  @Column({type:'bigint'})
  dateCreated: number;

  /** Requested Program Expiration Date */
  @Column({type:'bigint', nullable: true})
  expiration: any;

  /** Whether the Request has expired or been closed. */
  @Column()
  closed: boolean;

  /** Client that entered this request. */
  @ManyToOne(type => User, user => user.programRequests, {eager: true})
  client: User;

  /** Soft Skills to be included in the requested Program. */
  @ManyToMany(type => SoftSkill, softSkills => softSkills.programRequests, {eager: true})
  @JoinTable()
  softSkills: SoftSkill[];
}
