import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, ManyToMany, JoinTable } from "typeorm";
import { Video } from './Video';
import { User } from "./User";
import { Response } from "./Response";

/** Playlist of videos generated by an Admin for a Client */
@Entity('programs')
export class Program {
  /** Autogenerated id as a UUID string. */
  @PrimaryGeneratedColumn("uuid")
  id: string;

  /** Job title this program is for */
  @Column()
  jobTitle: string;

  /** Description of the playlist. Nullable. */
  @Column({nullable: true})
  description: string;

  /** Expiration date of the playlist as a UNIX timestamp. Nullable. */
  @Column({type:'bigint', nullable: true})
  expiration: number;

  /** Whether the Program has been closed. */
  @Column()
  closed: boolean;

  /** All videos in the Program's playlist. */
  @ManyToMany(type => Video, video => video.programs, {eager: true})
  @JoinTable()
  videos: Video[];

  /** The client this program was created for. */
  @ManyToOne(type => User, user => user.clientPrograms, {eager: true})
  client: User;

  /** The admin that created this program. */
  @ManyToOne(type => User, maker => maker.createdPrograms)
  author: User;

  /** All responses by subjects to the videos in this Program. */
  @OneToMany(type => Response, responses => responses.program)
  responses: Response[];
}
