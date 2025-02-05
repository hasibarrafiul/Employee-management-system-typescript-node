import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    JoinColumn,
  } from "typeorm";
  import { User } from "./User";
  
  @Entity("user_details")
  export class UserDetails {
    @PrimaryGeneratedColumn({ type: "int" })
    no!: number;
  
    @Column({ type: "varchar", length: 5 })
    id!: string;
  
    @Column({ type: "date" })
    birth!: Date;
  
    @Column({ type: "varchar", length: 40 })
    club!: string;
  
    @OneToOne(() => User, (user) => user.userDetails, { onDelete: "CASCADE" })
    @JoinColumn({ name: "id", referencedColumnName: "id" })
    user!: User;
  }
  