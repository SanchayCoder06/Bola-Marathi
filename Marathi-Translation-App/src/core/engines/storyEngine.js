/**
 * BOLA Marathi — Story Engine
 * Core Engine Layer
 * 
 * Coordinates Chapter Narratives, visual comic page layouts, and dialogue previews.
 */

export const StoryEngine = (() => {
  const STORIES = {
    pune_restaurant: {
      chapterId: 'ch3',
      title: "अध्याय ३: Restaurant",
      description: "या धध्यात तुम्ही रेस्टॉरंटमध्ये कसे बोलावे हे शिकाल, जसे की पाणी मागवणे, खाद्यपदार्थ मागवणे आणि शेवटी बिल भरणे.",
      coverImage: "assets/images/restaurant_scene.png",
      lessonsCompleted: "2/5 Lessons"
    }
  };

  function getStoryMetadata(storyId) {
    return STORIES[storyId] || null;
  }

  return {
    getStoryMetadata
  };
})();
