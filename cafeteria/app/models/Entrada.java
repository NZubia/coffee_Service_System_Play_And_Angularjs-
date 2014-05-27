package models;

import javax.persistence.*;
import play.db.jpa.Model;

@Entity
@Table (name = "entradas")
public class Entrada extends Model{
    
    @Column
    public Integer cantidad;
    
    @ManyToOne
    public Pedido pedido;
    
    @ManyToOne
    public Alimento alimento;

    public Entrada(Integer cantidad, Pedido pedido, Alimento alimento) {
        this.cantidad = cantidad;
        this.pedido = pedido;
        this.alimento = alimento;
    }
    
}
