import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Trash2, History, RefreshCw } from 'lucide-react-native';
import { useCalculatorHistory } from '@/hooks/useCalculatorHistory';

interface CalculatorHistoryProps {
  userId: string | undefined;
  onHistoryItemPress?: (expression: string) => void;
}

export default function CalculatorHistory({ 
  userId, 
  onHistoryItemPress 
}: CalculatorHistoryProps) {
  const { history, loading, error, clearHistory, refreshHistory } = useCalculatorHistory(userId);

  const handleClearHistory = () => {
    clearHistory();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      timeZone: 'Africa/Cairo',
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZoneName: 'short',
    });
  };

  const renderHistoryItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.historyItem}
      onPress={() => onHistoryItemPress?.(item.expression)}
      activeOpacity={0.7}
    >
      <View style={styles.historyContent}>
        <Text style={styles.expressionText}>{item.expression}</Text>
        <Text style={styles.resultText}>= {item.result}</Text>
      </View>
      <Text style={styles.timeText}>{formatDate(item.created_at)}</Text>
    </TouchableOpacity>
  );

  if (!userId) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <History size={48} color="#94A3B8" strokeWidth={1.5} />
          <Text style={styles.emptyTitle}>Sign in to view history</Text>
          <Text style={styles.emptySubtitle}>
            Your calculation history will be saved and synced across devices
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <History size={20} color="#1E293B" strokeWidth={2} />
          <Text style={styles.headerTitle}>History</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={refreshHistory}
            disabled={loading}
          >
            <RefreshCw 
              size={16} 
              color="#64748B" 
              strokeWidth={2}
            />
          </TouchableOpacity>
          {history.length > 0 && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleClearHistory}
              disabled={loading}
            >
              <Trash2 
                size={16} 
                color="#EF4444" 
                strokeWidth={2}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#3B82F6" />
          <Text style={styles.loadingText}>Loading history...</Text>
        </View>
      ) : history.length === 0 ? (
        <View style={styles.emptyState}>
          <History size={48} color="#94A3B8" strokeWidth={1.5} />
          <Text style={styles.emptyTitle}>No calculations yet</Text>
          <Text style={styles.emptySubtitle}>
            Your calculation history will appear here
          </Text>
        </View>
      ) : (
        <FlatList
          data={history}
          renderItem={renderHistoryItem}
          keyExtractor={(item) => item.id}
          style={styles.historyList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.historyContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginLeft: 8,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
  },
  historyList: {
    flex: 1,
  },
  historyContent: {
    padding: 8,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    marginVertical: 2,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  historyContent: {
    flex: 1,
  },
  expressionText: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 2,
  },
  resultText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  timeText: {
    fontSize: 12,
    color: '#94A3B8',
    marginLeft: 12,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 12,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    marginLeft: 8,
    color: '#64748B',
    fontSize: 14,
  },
  errorContainer: {
    padding: 16,
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    margin: 8,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    textAlign: 'center',
  },
});