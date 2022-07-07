package com.baufest.tennis.springtennis.service;



import com.baufest.tennis.springtennis.dto.EntrenadorDTO;
import com.baufest.tennis.springtennis.mapper.EntrenadorMapperImpl;
import com.baufest.tennis.springtennis.model.Entrenador;
import com.baufest.tennis.springtennis.repository.EntrenadorRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class EntrenadorServiceTest {

    private final List<Entrenador> entrenadoresDePrueba = new ArrayList<>();
    private final List<EntrenadorDTO> entrenadoresDTODePrueba = new ArrayList<>();
    private final EntrenadorDTO entrenadorDTOParaAgregar = new EntrenadorDTO();
    private final Entrenador entrenadorParaAgregar = new Entrenador();

    EntrenadorServiceImpl entrenadorService;

    @Mock
    EntrenadorRepository entrenadorRepository;

    @BeforeEach
    void setUp(){
        entrenadoresDTODePrueba.clear();

        EntrenadorDTO entrenadorDTO1 = new EntrenadorDTO(1L,"Federico");
        entrenadoresDTODePrueba.add(entrenadorDTO1);

        Entrenador entrenador1 = new Entrenador(1L,"Federico");
        entrenadoresDePrueba.add(entrenador1);

        entrenadorService = new EntrenadorServiceImpl(entrenadorRepository,new EntrenadorMapperImpl());
    }

    @Test
    void testagregarEntrenador() {
        ArgumentCaptor<Entrenador> argumentCaptor = ArgumentCaptor.forClass(Entrenador.class);
        when(entrenadorRepository.save(argumentCaptor.capture())).thenReturn(entrenadorParaAgregar);
        EntrenadorDTO entrenadorDTO = entrenadorService.save(entrenadorDTOParaAgregar);
        assertEquals(entrenadorDTOParaAgregar.getId(), argumentCaptor.getValue().getId());
        assertEquals(entrenadorParaAgregar.getId(), entrenadorDTO.getId());
        assertEquals(entrenadorParaAgregar.getNombre(), entrenadorDTO.getNombre());
        verify(entrenadorRepository).save(any(Entrenador.class));
    }

    @Test
    void testListaEntrenador() {
        when(entrenadorRepository.findAllByOrderByNombreAsc()).thenReturn(entrenadoresDePrueba);
        List<EntrenadorDTO> entrenadoresObtenidos = entrenadorService.listAll();
        assertEquals(entrenadoresDTODePrueba.size(), entrenadoresObtenidos.size());
        verify(entrenadorRepository, times(1)).findAllByOrderByNombreAsc();
    }
}
