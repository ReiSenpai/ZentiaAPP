package zentia.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import zentia.backend.entity.Content;
import zentia.backend.entity.ContentType;
import zentia.backend.repository.ContentRepository;

@Service
public class ContentService {
    private final ContentRepository contentRepository;

    public ContentService(ContentRepository contentRepository) {
        this.contentRepository = contentRepository;
    }

    public List<Content> getAllContent() {
        return contentRepository.findAll();
    }

    public Content saveContent(Content contentRequest) {
        if (contentRequest.getType() == ContentType.SERIES && contentRequest.getSeasons() != null) {
            contentRequest.getSeasons().forEach(season -> {
                season.setContent(contentRequest);
                if (season.getEpisodes() != null) {
                    season.getEpisodes().forEach(episode -> episode.setSeason(season));
                }
            });
        }
        return contentRepository.save(contentRequest);
    }
}
