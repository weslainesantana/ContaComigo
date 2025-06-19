import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useGame } from '../../contexts/GameContext';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';

export const GameStatus = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const {
    level,
    xp,
    xpToNextLevel,
    unlockedAchievements
  } = useGame();

  const progress = Math.min((xp / xpToNextLevel) * 100, 100);
  const [showAchievements, setShowAchievements] = React.useState(false);

  const dynamicStyles = styles(isDark);

  return (
    <View style={dynamicStyles.container}>
      <View style={dynamicStyles.levelContainer}>
        <View style={dynamicStyles.levelBadge}>
          <Text style={dynamicStyles.levelText}>{level}</Text>
        </View>
        <Text style={dynamicStyles.levelLabel}>Nível</Text>
      </View>

      <View style={dynamicStyles.progressContainer}>
        <View style={dynamicStyles.progressBar}>
          <View
            style={[
              dynamicStyles.progressFill,
              { width: `${progress}%` }
            ]}
          />
        </View>
        <Text style={dynamicStyles.xpText}>
          {xp}/{xpToNextLevel} XP ({Math.floor(progress)}%)
        </Text>
      </View>

      <TouchableOpacity
        style={dynamicStyles.achievementsButton}
        onPress={() => setShowAchievements(!showAchievements)}
      >
        <MaterialIcons
          name={showAchievements ? "expand-less" : "expand-more"}
          size={24}
          color={isDark ? "#60a5fa" : "#3b82f6"}
        />
        <Text style={dynamicStyles.achievementsButtonText}>
          Conquistas ({unlockedAchievements.length})
        </Text>
      </TouchableOpacity>

      {showAchievements && (
        <View style={dynamicStyles.achievementsContainer}>
          {unlockedAchievements.length > 0 ? (
            unlockedAchievements.map(achievement => (
              <View key={achievement.id} style={dynamicStyles.achievementItem}>
                <MaterialIcons
                  name="emoji-events"
                  size={20}
                  color="#f59e0b"
                  style={dynamicStyles.achievementIcon}
                />
                <View style={dynamicStyles.achievementTextContainer}>
                  <Text style={dynamicStyles.achievementTitle}>{achievement.name}</Text>
                  <Text style={dynamicStyles.achievementDescription}>
                    {achievement.description}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={dynamicStyles.noAchievementsText}>
              Nenhuma conquista desbloqueada ainda!
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

const styles = (isDark) => StyleSheet.create({
  container: {
    backgroundColor: isDark ? '#1f2937' : '#ffffff',
    borderRadius: 12,
    padding: 16,
    margin: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    width: '100%',
  },
  levelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  levelBadge: {
    backgroundColor: '#3b82f6',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  levelText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  levelLabel: {
    fontSize: 16,
    color: isDark ? '#d1d5db' : '#4b5563',
    fontWeight: '500',
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressBar: {
    height: 10,
    backgroundColor: isDark ? '#374151' : '#e5e7eb',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10b981',
  },
  xpText: {
    fontSize: 12,
    color: isDark ? '#9ca3af' : '#6b7280',
    textAlign: 'right',
  },
  achievementsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  achievementsButtonText: {
    color: isDark ? '#60a5fa' : '#3b82f6',
    fontWeight: '600',
    marginLeft: 6,
  },
  achievementsContainer: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: isDark ? '#374151' : '#e5e7eb',
    paddingTop: 12,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: isDark ? '#4b5563' : '#f3f4f6',
  },
  achievementIcon: {
    marginRight: 10,
  },
  achievementTextContainer: {
    flex: 1,
  },
  achievementTitle: {
    fontWeight: '600',
    color: isDark ? '#f3f4f6' : '#1f2937',
    fontSize: 14,
  },
  achievementDescription: {
    color: isDark ? '#9ca3af' : '#6b7280',
    fontSize: 12,
    marginTop: 2,
  },
  noAchievementsText: {
    color: isDark ? '#6b7280' : '#9ca3af',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 8,
  },
});