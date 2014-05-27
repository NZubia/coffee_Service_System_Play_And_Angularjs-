package controllers;

import flexjson.JSONSerializer;
import play.*;
import play.mvc.*;
import java.util.*;
import models.Alimento;
import models.Entrada;
import models.Pedido;
import models.Usuario;


public class Application extends Controller {
    
    public static void index() {
        render();
    }

    public static void getAlimentos(){
        //List<Alimento> alimentos = Alimento.find("categoria", categoria).fetch
        List<Alimento> alimentos = Alimento.findAll();
        renderJSON(alimentos);
    }
    
    public static void getAlimento(String id){
        Alimento alimento = Alimento.find("byID", id).first();
        renderJSON(alimento);
    }
    
    public static void crearUsuario(String nombre, String correo, String direccion, String telefono, String contrasena){
        Usuario usuario = new Usuario(nombre, correo, direccion, telefono, contrasena);
        usuario.save();
    }
    
    public static void login (String correo, String contrasena){
        Usuario u = Usuario.find("byCORREOAndCONTRASENA",correo,contrasena).first();      
        renderJSON(u);
    }
    
    public static void crearPedido(String id){
        Usuario usuario = Usuario.find("byID",id).first();
        Pedido pedido = new Pedido("ACTIVO", usuario).save();
        cargarPedido(id);
        renderJSON(pedido);
    }
    
    public static void cargarPedido(String idUsuario){
        System.out.println(idUsuario);
        Usuario u = Usuario.find("byID",idUsuario).first();
        Pedido pedido = Pedido.find("byCLIENTE_IDAndStatus", u.id,"ACTIVO").first();
        
        
        
        if(pedido == null){
            crearPedido(idUsuario);
        }
        else
            renderJSON(pedido);
        //Pendiente
    }
    
    public static void getEntradas(String idPedido){
        Pedido pedido = Pedido.find("byID", idPedido).first();
        List <Entrada> entradas = Entrada.find("byPEDIDO_ID",pedido.id).fetch();
        
        renderJSON(new JSONSerializer().include(
                    "id", "alimento.id", "alimento.nombre","cantidad","alimento.price").exclude("*").serialize(entradas));
    }
    
    public static void agregarAPedido(Integer cantidad, String pedidoId, String alimentoId, String entradaId ){
        Pedido pedido = Pedido.find("byID",pedidoId).first();
        Alimento alimento = Alimento.find("byID",alimentoId).first();
        Entrada entrada = Entrada.find("byID",entradaId).first();
        
        if(entrada == null){
            entrada = new Entrada(1, pedido, alimento).save();
            agregarAPedido(cantidad, pedidoId, alimentoId, Long.toString(entrada.id));
        }
        
        entrada.cantidad = cantidad;
        entrada.save();
        
        renderJSON(new JSONSerializer().include(
                    "id", "alimento.id", "alimento.nombre","cantidad","alimento.price").exclude("*").serialize(entrada));
    }
    
    public static void eliminarEntrada(String entradaId){
        Entrada entrada = Entrada.find("byID",entradaId).first();
        
        entrada.delete();
        
    }
    
    public static void pagar(String pedidoId, String usuarioId){
        Usuario u = Usuario.find("byID",usuarioId).first();
        Pedido pedido = Pedido.find("byID",pedidoId).first();
        
        pedido.status = "INACTIVO";
        
        pedido.save();
    }
    
    

}