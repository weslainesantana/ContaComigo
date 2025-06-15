import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useGame } from '../../contexts/GameContext';
import { MaterialIcons } from '@expo/vector-icons';

export const GameStatus = () => {
  const { 
    level, 
    xp, 
    xpToNextLevel, 
    unlockedAchievements
  } = useGame();
  
  const progress = Math.min((xp / xpToNextLevel) * 100, 100);
  const [showAchievements, setShowAchievements] = React.useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.levelContainer}>
        <View style={styles.levelBadge}>
          <Text style={styles.levelText}>{level}</Text>
        </View>
        <Text style={styles.levelLabel}>Nível</Text>
      </View>
      
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${progress}%` }
            ]} 
          />
        </View>
        <Text style={styles.xpText}>
          {xp}/{xpToNextLevel} XP ({Math.floor(progress)}%)
        </Text>
      </View>
      
      <TouchableOpacity 
        style={styles.achievementsButton}
        onPress={() => setShowAchievements(!showAchievements)}
      >
        <MaterialIcons 
          name={showAchievements ? "expand-less" : "expand-more"} 
          size={24} 
          color="#3b82f6" 
        />
        <Text style={styles.achievementsButtonText}>
          Conquistas ({unlockedAchievements.length})
        </Text>
      </TouchableOpacity>

      {showAchievements && (
        <View style={styles.achievementsContainer}>
          {unlockedAchievements.length > 0 ? (
            unlockedAchievements.map(achievement => (
              <View key={achievement.id} style={styles.achievementItem}>
                <MaterialIcons 
                  name="emoji-events" 
                  size={20} 
                  color="#f59e0b" 
                  style={styles.achievementIcon}
                />
                <View style={styles.achievementTextContainer}>
                  <Text style={styles.achievementTitle}>{achievement.name}</Text>
                  <Text style={styles.achievementDescription}>
                    {achievement.description}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.noAchievementsText}>
              Nenhuma conquista desbloqueada ainda!
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    margin: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
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
    color: '#4b5563',
    fontWeight: '500',
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressBar: {
    height: 10,
    backgroundColor: '#e5e7eb',
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
    color: '#6b7280',
    textAlign: 'right',
  },
  achievementsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  achievementsButtonText: {
    color: '#3b82f6',
    fontWeight: '600',
    marginLeft: 6,
  },
  achievementsContainer: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 12,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  achievementIcon: {
    marginRight: 10,
  },
  achievementTextContainer: {
    flex: 1,
  },
  achievementTitle: {
    fontWeight: '600',
    color: '#1f2937',
    fontSize: 14,
  },
  achievementDescription: {
    color: '#6b7280',
    fontSize: 12,
    marginTop: 2,
  },
  noAchievementsText: {
    color: '#9ca3af',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 8,
  },
});