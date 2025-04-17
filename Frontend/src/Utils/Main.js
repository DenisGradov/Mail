export const getShortText = (text,limit,line) => {
  return text.length > limit ? (line&&'— ') + text.slice(0, limit) + '...' : (line&&'— ') + text;
}

export const getDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();

  const isToday = date.toDateString() === now.toDateString();

  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);

  const diffDays = (now - date) / (1000 * 60 * 60 * 24);

  if (isToday) {
    // Сегодня — время
    return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  } else if (diffDays < 7) {
    // Вчера и до недели назад — день недели
    return date.toLocaleDateString('en-GB', { weekday: 'short' }); // Mon, Tue и т.д.
  } else {
    // Старше недели — дата DD.MM
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
    });
  }
};


export const clearErrorOnInputChange = (inputName, setError) => {
  setError((prev) => ({
    ...prev,
    [inputName]: '',
  }));
};

export const validateInputs = (fields, rules) => {
  const errors = {};

  for (const name in rules) {
    const rule = rules[name];

    if (rule.type === 'boolean') {
      if (fields[name] === false) {
        errors[name] = rule.message || 'Согласитесь';
      }
    } else {
      const value = fields[name]?.trim() || '';

      if (rule.required && !value) {
        errors[name] = rule.message || 'Поле не может быть пустым';
      } else if (rule.minLength && value.length < rule.minLength) {
        errors[name] = rule.message || `Минимум ${rule.minLength} символов`;
      } else if (rule.equals && value !== fields[rule.equals]) {
        errors[name] = rule.message || 'Поля должны совпадать';
      }

    }
  }
  return errors;
};


export const handleGeneratePassword = () => {
  const length = Math.floor(Math.random() * 3) + 6; // Генерируем длину от 6 до 8 символов
  const charset =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let password = "";

  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }

  return password;
}