
package models;

import javax.persistence.*;
import play.db.jpa.Model;

@Entity
@Table (name = "usuarios")
public class Usuario extends Model{
    
    @Column
    public String nombre;
    public String correo;
    public String direccion;
    public String telefono;
    public String contrasena;

    public Usuario(String nombre, String correo, String direccion, String telefono, String contrasena) {
        this.nombre = nombre;
        this.correo = correo;
        this.direccion = direccion;
        this.telefono = telefono;
        this.contrasena = contrasena;
    }
    

        
    
}
