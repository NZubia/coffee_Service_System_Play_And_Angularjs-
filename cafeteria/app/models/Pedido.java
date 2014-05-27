package models;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import play.db.jpa.Model;

@Entity
@Table (name = "pedidos")
public class Pedido extends Model{
    
    @Column
    public String status;
    
    @ManyToOne
    public Usuario cliente;

    public Pedido(String status, Usuario cliente) {
        this.status = status;
        this.cliente = cliente;
    }
    
    
    
}
