import { User } from "src/models/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Avatar {
    @PrimaryGeneratedColumn()
    id: number;
        
    @ManyToOne(() => User, (user) => user.avatars, {cascade: true, onDelete: "CASCADE"})
    @JoinColumn()
    user: User;

    @Column()
    data: string;
}