package com.baufest.tennis.springtennis.model;

import org.json.JSONObject;

import javax.persistence.*;

@Entity
@Table(name="Entrenador")
public class Entrenador {

    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;


    public Entrenador(){}
    public Entrenador(Long id, String nombre) {
        this.id = id;
        this.nombre = nombre;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public JSONObject toJSONObject() {
        JSONObject jo = new JSONObject();
        jo.put("id",getId());
        jo.put("nombre",getNombre());
        return jo;
    }
}
