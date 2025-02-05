import {
    Entity,
    PrimaryColumn,
    Column,
    OneToOne,
  } from "typeorm";
  import { UserDetails } from "./UserDetails";
  
  @Entity("users")
  export class User {
    @PrimaryColumn({ type: "varchar", length: 5 })
    id!: string;
  
    @Column({ type: "varchar", length: 8 })
    password!: string;
  
    @Column({ type: "varchar", length: 40 })
    name!: string;
  
    @Column({ type: "varchar", length: 40 })
    kana!: string;
  
    @OneToOne(() => UserDetails, (userDetails) => userDetails.user, {
      cascade: ["insert", "update"] 
    })
    userDetails?: UserDetails;
  }
  