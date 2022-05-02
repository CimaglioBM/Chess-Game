#///////////////////////////////////////////////#
#
# create the model
#
#///////////////////////////////////////////////#
from tensorflow.keras.layers import Conv2D,Dense,Flatten
from tensorflow.keras.models import Sequential

def createModel():
    model = Sequential()

    model.add(Conv2D(12, 2,input_shape = (8,8,1)))
    #model.add(Dense(10))
    model.add(Flatten())
    model.add(Dense(1, activation="linear"))

    #print(model.summary())
    return model 

