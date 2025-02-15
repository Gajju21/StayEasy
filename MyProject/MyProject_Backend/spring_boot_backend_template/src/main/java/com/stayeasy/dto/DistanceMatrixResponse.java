package com.stayeasy.dto;
import java.util.List;

import com.google.maps.model.DistanceMatrixRow;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DistanceMatrixResponse {
    private List<DistanceMatrixRow> rows;
}
