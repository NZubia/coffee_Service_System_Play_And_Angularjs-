package models;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import play.db.jpa.Model;

@Entity
@Table (name = "alimentos")
public class Alimento extends Model{
    
    @Column
    public String nombre;
    public String descripcion;
    public Double price;
    public String imagen;
    public String categoria;

    public Alimento(String nombre, String descripcion, Double price, String imagen, String categoria) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.price = price;
        this.imagen = imagen;
        this.categoria = categoria;
    }

    
    
    
}
