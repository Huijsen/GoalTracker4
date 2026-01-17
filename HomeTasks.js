import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import TaskItem from '../Functions/TaskItem';
import { styles } from '../styles';

export default function HomeTasks({
  isAddingTask,
  newTaskText,
  setNewTaskText,
  filteredSuggestions,
  setFilteredSuggestions,
  goals,
  handleAddTask,
  handleAddSuggestionTask,
  setIsAddingTask,
  tasks,
  doneTasks,
  doneCollapsed,
  setDoneCollapsed,
  toggleCheckTask,
  toggleUncheckDoneTask,
  updateSubtaskChecked,
  deleteSubtask,
  setSelectedTask,
  setEditedText,
  setEditedDesc,
  setSelectedSubtask,
  setEditedSubtaskText,
  setEditedSubtaskDesc,
  setSubtaskFromTaskModal,
  setCurrentPage,
  inputRef,
}) {
  const wrapperRef = useRef(null);

  const saveTaskIfNeeded = () => {
    if (newTaskText.trim()) handleAddTask();
    setIsAddingTask(false);
    setNewTaskText('');
    setFilteredSuggestions([]);
    Keyboard.dismiss();
  };

  useEffect(() => {
    if (isAddingTask) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isAddingTask]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback
        onPress={(e) => {
          // only save if the tap is outside the input wrapper
          wrapperRef.current?.measure((fx, fy, width, height, px, py) => {
            const { locationX, locationY } = e.nativeEvent;
            if (
              locationX < px ||
              locationX > px + width ||
              locationY < py ||
              locationY > py + height
            ) {
              saveTaskIfNeeded();
            }
          });
        }}
      >
        <View style={{ flex: 1 }}>
          {isAddingTask && (
            <View ref={wrapperRef} style={styles.taskInputWrapper}>
              <View style={styles.squareBox} />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <TextInput
                  ref={inputRef}
                  placeholder="Type your task"
                  value={newTaskText}
                  onChangeText={(text) => {
                    setNewTaskText(text);
                    if (!text.length) {
                      setFilteredSuggestions(
                        goals.map((g) => `Goal - ${g.title}`)
                      );
                    } else {
                      setFilteredSuggestions(
                        goals
                          .map((g) => `Goal - ${g.title}`)
                          .filter((item) =>
                            item.toLowerCase().startsWith(text.toLowerCase())
                          )
                      );
                    }
                  }}
                  style={styles.underlineInput}
                  autoFocus
                  onSubmitEditing={() => {
                    if (newTaskText.trim()) saveTaskIfNeeded(); // save on Enter
                  }}
                />
                {filteredSuggestions.length > 0 && (
                  <View style={{ maxHeight: 120, marginTop: 5 }}>
                    {filteredSuggestions.map((item) => (
                      <Pressable
                        key={item}
                        onPress={() => handleAddSuggestionTask(item)}
                        style={{
                          padding: 8,
                          backgroundColor: '#eee',
                          marginBottom: 2,
                          borderRadius: 5,
                        }}
                      >
                        <Text>{item}</Text>
                      </Pressable>
                    ))}
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Tasks list */}
          {tasks.map((task, i) => (
            <TaskItem
              key={i}
              text={task.text}
              checked={false}
              subtitle={task.desc}
              subtasks={task.subtasks}
              onToggle={() => toggleCheckTask(i)}
              onToggleSubtask={(sub) => updateSubtaskChecked(i, sub)}
              onDeleteSubtask={(sub) => deleteSubtask(i, sub)}
              onPress={() => {
                setSelectedTask(i);
                setEditedText(task.text);
                setEditedDesc(task.desc);
                setCurrentPage('editTask');
              }}
              onPressSubtask={(subIdx) => {
                setSelectedSubtask({ taskIdx: i, subIdx });
                setEditedSubtaskText(task.subtasks[subIdx].text);
                setEditedSubtaskDesc(task.subtasks[subIdx].desc || '');
                setSubtaskFromTaskModal(false);
                setCurrentPage('editSubtask');
              }}
            />
          ))}

          {/* Done toggle */}
          <TouchableOpacity
            onPress={() => setDoneCollapsed(!doneCollapsed)}
            style={{
              padding: 10,
              backgroundColor: 'white',
              marginTop: 20,
              marginHorizontal: 25,
              borderRadius: 10,
              alignItems: 'center',
            }}
          >
            <Text style={{ fontWeight: 'bold' }}>
              Done Tasks {doneCollapsed ? '▼' : '▲'}
            </Text>
          </TouchableOpacity>

          {!doneCollapsed &&
            doneTasks.map((task, i) => (
              <TaskItem
                key={i}
                text={task.text}
                checked
                subtitle={task.desc}
                subtasks={task.subtasks}
                onToggle={() => toggleUncheckDoneTask(i)}
                onToggleSubtask={() => {}}
                onPress={() => {}}
                onPressSubtask={() => {}}
              />
            ))}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
