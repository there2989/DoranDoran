package com.e102.quiz.dto;

import lombok.*;

@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class PlayLogRequestDTO {

    private int userId;

    private int quizId;
}
