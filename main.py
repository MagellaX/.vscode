import numpy as np
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt  
from sklearn.datasets import load_iris

iris = load_iris()
data = pd.DataFrame(iris.data, columns=iris.feature_names)
target = iris.target

plt.figure(figsize=(7.5, 3.5))

corr = data.corr()
sns.set(style='white')
mask = np.zeros_like(corr, dtype=np.bool)
mask[np.triu_indices_from(mask)] = True
f, ax = plt.subplots(figsize=(11, 9))
cmap = sns.diverging_palette(220, 10, as_cmap=True)
sns.heatmap(corr, mask=mask, cmap=cmap, vmax=.3, center=0,
   square=True, linewidths=.5, cbar_kws={"shrink": .5})
plt.show()
