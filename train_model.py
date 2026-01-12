import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error
import numpy as np

df = pd.read_csv('training_data.csv')
y = df['LapTimeSeconds']
X = df.drop(['Driver', 'LapTimeSeconds', 'Team'], axis=1)

print(f"Features used: {X.columns.tolist()}")

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = LinearRegression()
model.fit(X_train, y_train)

predictions = model.predict(X_test)
rmse = np.sqrt(mean_squared_error(y_test, predictions))

print(f"\nModel RMSE: {rmse:.4f} seconds")
print("Interpreting the model:")
print(f"Base Lap Time (Intercept): {model.intercept_:.2f} s")

# Show the 'weight' the model assigned to each feature
coefficients = pd.DataFrame({'Feature': X.columns, 'Weight': model.coef_})
print(coefficients)
