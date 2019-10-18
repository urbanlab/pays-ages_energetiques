from math import *
import numpy as np
import pandas as pd
import csv

#Useful datas

liste_geocord = [(45.4754,5.1615),(49.3038,4.2200),(47.3609,7.2945),(47.5436,6.5834),(49.2534,4.0734),(49.1948,6.0346)]
solaire = [[0.057699, 0.07904994, 0.08635396, 0.10858142, 0.11445617, 0.11575437,  0.13084271],[0.03652815, 0.05845178, 0.06132193, 0.06854147, 0.08185683, 0.08156287, 0.08979428],[0.003363166572244678, 0.005205245917756533, 0.0057056026205262395, 0.0066421559152080745, 0.007261421679829396, 0.007002951070338823, 0.007571849202825502],[0.003363166572244678, 0.005205245917756533, 0.0057056026205262395, 0.0066421559152080745, 0.007261421679829396, 0.007002951070338823, 0.007571849202825502],[0.03652815, 0.05845178, 0.06132193, 0.06854147, 0.08185683, 0.08156287, 0.08979428],[0.020079576584608953, 0.04468196406852317, 0.04543248985645491, 0.049958710273992665, 0.053449960489199276, 0.05014764948901361, 0.05743252198021069]]
eolien = [[0.00196601, 0.002082, 0.00121417, 0.0011379, 0.00156527, 0.00207139, 0.00218576],[0.30694908, 0.39017694, 0.41815031, 0.47930524, 0.65395812, 0.67755015, 0.82600068],[0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],[0.075067423253157, 0.09261832050434281, 0.09140924412525514, 0.090496534626061, 0.11666244153599926, 0.10859415297013973, 0.10711895477020063]]
hydro = [[0.3362992, 0.44079622, 0.44025701, 0.43269603, 0.39059185, 0.37939476,  0.37661321],[0.00335231, 0.00651524, 0.00771901, 0.00406973, 0.00929903, 0.01279111, 0.0086786 ],[0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],[0.12529931902810604, 0.17210150710027167, 0.24001529237474437, 0.17467670102148095, 0.15471612922657307, 0.21284092147846, 0.14331976700646307]]
biomasse = [[0.42546185, 0.47545944, 0.47009434, 0.4930408,  0.44526838, 0.45406087,  0.47725172],[0.11549289, 0.10515691, 0.11188222, 0.11275899, 0.14199611, 0.17627175, 0.1986242],[0.05365711118507799, 0.035262736142353146, 0.027295500456534935, 0.04603125113261594, 0.07616289782232288, 0.04999320530293683, 0.06704506414058213],[0.12291380364212272, 0.11557454323271472, 0.13343570536452085, 0.14152982926883345, 0.15088111273854216, 0.15303097415184325, 0.13283256207374525]]
##Useful functions
def distance(geocord_A,geocord_B):
	x_A, y_A = geocord_A
	x_B, y_B = geocord_B
	return sqrt((x_B-x_A)**2+(y_B-y_A)**2)

def closest(liste_geocord, geocord_A):
	minimum = distance(liste_geocord[0],geocord_A)
	minimu_index = 0
	n= len(liste_geocord)
	for i in range(n):
		value = distance(liste_geocord[i],geocord_A)
		if value<minimum:
			minimum = value 
			minimu_index = i
	return minimum_index

def max_list_of_lists(liste):
	#return the maximum value of a list of lists
	maximum = 0
	for i in range(len(liste)):
		if max(liste[i]) > maximum:
			maximum = max(liste[i])
	return maximum

def min_list_of_lists(liste):
	#return the minimum value of a list of lists
	minimum = 1e10
	for i in range(len(liste)):
		if min(liste[i]) < minimum:
			minimum = min(liste[i])
	return minimum



#Function by dataset : energy

def create_data_energy():
	#reshape the Enedis dataset giving a 3 dimensionnal array : first dimension is for the department, second one for the king of energy (sun, wind,water, wood, x_coord, y_coord), last one for the year (from 2011 to 2017)
	data = np.zeros((96,6,7))
	with open('production-electrique-par-filiere-a-la-maille-departement.csv','r') as csvinput:
		count = 0
		minimum = 1e10
		eolien = 0
		hydro = 0
		solaire = 0 
		biomasse = 0
		for row in csv.reader(csvinput,delimiter=";"):
			if count > 0:
				if int(row[0]) == 2017: #only year with 
					x_B = float(row[-1][0:12])
					y_B = float(row[-1][14:-1])
					try:
						data[int(row[2])][0][6] += float(row[7])
					except ValueError:
						pass
					try:
						data[int(row[2])][1][6] += float(row[9])
					except ValueError:
						pass
					try:
						data[int(row[2])][2][6] += float(row[11])
					except ValueError:
						pass
					try:
						data[int(row[2])][3][6] += float(row[13])
					except ValueError:
						pass
					data[int(row[2])][4][6] = x_B
					data[int(row[2])][5][6] = y_B	
			count += 1
	with open('production-electrique-par-filiere-a-la-maille-departement.csv','r') as csvinput2:
		count=0
		for row in csv.reader(csvinput2,delimiter=";"):
			if count > 0:
				if int(row[0]) != 2017: 
					try:
						data[int(row[2])][0][int(row[0])-2011] += float(row[7])
					except ValueError:
						pass
					try:
						data[int(row[2])][1][int(row[0])-2011] += float(row[9])
					except ValueError:
						pass
					try:
						data[int(row[2])][2][int(row[0])-2011] += float(row[11])
					except ValueError:
						pass
					try:
						data[int(row[2])][3][int(row[0])-2011] += float(row[13])
					except ValueError:
						pass
					data[int(row[2])][4][int(row[0])-2011] = data[int(row[2])][4][6]
					data[int(row[2])][5][int(row[0])-2011] = data[int(row[2])][5][6]
			count += 1
		for j in range(4):
			local_maximum = 0
			for i in range(96):
				for annee in range(7):
					if data[i][j][annee] > local_maximum:
						local_maximum = data[i][j][annee]
			for i in range(96):
				for annee in range(7):
					data[i][j][annee] = data[i][j][annee]/local_maximum
	return data


def energy_production(geocord_A): 
	#give the renewable energy production depending on the location (normalize values)
	data = create_data_energy()
	minimum = distance(geocord_A,(data[0][4][6],data[0][5][6]))
	minimum_index = 0
	for i in range(96):
		current_distance = distance(geocord_A,(data[i][4][6],data[i][5][6]))
		if current_distance<minimum:
			minimum = current_distance
			minimum_index = i
	return "solaire", list(data[minimum_index][0]), "biomasse",list(data[minimum_index][1]),'hydro', list(data[minimum_index][2]), 'biomasse',list(data[minimum_index][3])

def energy_production_liste(liste_values):
	#normalize values of a liste 
	maximum = max_list_of_lists(liste_values)
	minimum = min_list_of_lists(liste_values)
	for i in range(len(liste_values)):
		for annee in range(7):
			liste_values[i][annee] = 1-1/(maximum-minimum)*(liste_values[i][annee]-minimum)
	return liste_values

print(energy_production_liste(biomasse))
"""
def energy_production_liste(liste_geocord): -> to improve
	#give the renewable energy production for all the locations (normalize values)
	data = create_data_energy()
	results = []
	for g in range(len(liste_geocord)):
		minimum = distance(liste_geocord[g],(data[0][4][6],data[0][5][6]))
		minimum_index = 0
		for i in range(96):
			current_distance = distance(liste_geocord[g],(data[i][4][6],data[i][5][6]))
			if current_distance<minimum:
				minimum = current_distance
				minimum_index = i
		results.append(list(data[minimum_index][0:4]))
		print("coordonnees",list(data[minimum_index][0:4]))
	return results

print(energy_production_liste([(45,1),(40,2)]))""" 



def production(departement):
	#give the production of a department along the years - just for a test
	with open('production-electrique-par-filiere-a-la-maille-departement.csv','r') as csvinput:
		count =0 
		liste = 7*[0]
		for row in csv.reader(csvinput,delimiter=";"):
			if count > 0: 
				if int(row[2])==departement:
					try:
						value = float(row[11])
					except ValueError:
						value = 0
					liste[int(row[0])-2011] += int(value)
			count +=1
	return liste


## Function by dataset : electricty consumption
def create_data_electricity_consumption():
#reshape the Enedis dataset giving a 2 dimensionnal array : first dimension is for the department, scond ohe for the year (from 2011 to 2017)
	data = np.zeros((96,3,7))
	with open('production-electrique-par-filiere-a-la-maille-departement.csv','r') as csvinput:
		count = 0 
		for row in csv.reader(csvinput,delimiter=";"):
			if count > 0:
				if int(row[0]) == 2017: #only year with 
					x_B = float(row[-1][0:12])
					y_B = float(row[-1][14:-1])
					try:
						data[int(row[2])][0][6] += float(row[6])
					except ValueError:
						pass
					data[int(row[2])][1][6] = x_B
					data[int(row[2])][2][6] = y_B	
			count += 1
	with open('production-electrique-par-filiere-a-la-maille-departement.csv','r') as csvinput2:
		count=0
		for row in csv.reader(csvinput2,delimiter=";"):
			if count > 0:
				if int(row[0]) != 2017: 
					try:
						data[int(row[2])][0][int(row[0])-2011] += float(row[6])
					except ValueError:
						pass
					data[int(row[2])][1][int(row[0])-2011] = data[int(row[2])][1][6]
					data[int(row[2])][2][int(row[0])-2011] = data[int(row[2])][2][6]
			count += 1

		local_maximum = 0
		for i in range(96):
			for annee in range(7):
				if data[i][0][annee] > local_maximum:
					local_maximum = data[i][0][annee]
		for i in range(96):
			for annee in range(7):
				data[i][0][annee] = data[i][0][annee]/local_maximum
	return data 

def electricity_consumption(geocord_A): 
	#give the energy consumption depending on the location (normalize values)
	data = create_data_electricity_consumption()
	minimum = distance(geocord_A,(data[0][1][6],data[0][2][6]))
	minimum_index = 0
	for i in range(96):
		current_distance = distance(geocord_A,(data[i][1][6],data[i][2][6]))
		if current_distance<minimum:
			minimum = current_distance
			minimum_index = i
	return list(data[minimum_index][0])

def electricity_consumption_liste(liste_geocord):
	#give the electricity consumption for all the locations (normalize values)
	data = create_data_electricity_consumption()
	n = len(liste_geocord)
	results = []
	for g in range(n):
		minimum = distance(liste_geocord[g],(data[0][1][6],data[0][2][6]))
		minimum_index = 0
		for i in range(96):
			current_distance = distance(liste_geocord[g],(data[i][1][6],data[i][2][6]))
			if current_distance<minimum:
				minimum = current_distance
				minimum_index = i
		results.append(list(data[minimum_index][0]))
	maximum = max_list_of_lists(results)
	minimum = min_list_of_lists(results)
	for i in range(n):
		for annee in range(7):
			results[i][annee] = 1/(maximum-minimum)*(results[i][annee] - minimum) 
	return results


## Function by dataset : gas consumption
def get_departement_from_iris(string):
	#transform an iris code into a department number
	if len(string)==8:
		department = int(string[0])
	elif len(string) == 9:
		department = int(string[0:2])
	else:
		department = 0
	return department


def create_data_gas_consumption():
	#Reshape the GRDF database of the gas consumption
	data = np.zeros((96,3,7))
	data_elec = create_data_electricity_consumption()
	with open('consommation-annuelle-gaz-agregee-maille-iris.csv','r') as csvinput:
		count = 0 
		for row in csv.reader(csvinput,delimiter=";"):
			if count > 0:
				if int(row[0])>2010:
					try:
						data[get_departement_from_iris(row[6])][0][int(row[0])-2011] += float(row[21])
					except ValueError:
						pass
					try:
						data[get_departement_from_iris(row[6])][1][int(row[0])-2011] = data_elec[get_departement_from_iris(row[6])][1][int(row[0])-2011]
						data[get_departement_from_iris(row[6])][2][int(row[0])-2011] = data_elec[get_departement_from_iris(row[6])][2][int(row[0])-2011]
					except ValueError:
						pass	
			count += 1
	local_maximum = 0
	for i in range(96):
		for annee in range(7):
			if data[i][0][annee] > local_maximum:
				local_maximum = data[i][0][annee]
	for i in range(96):
		for annee in range(7):
			data[i][0][annee] = data[i][0][annee]/local_maximum
	return data

def gas_consumption(geocord_A): 
	#give the gas consumption depending on the location (normalize values)
	data = create_data_gas_consumption()
	minimum = distance(geocord_A,(data[0][1][6],data[0][2][6]))
	minimum_index = 0
	for i in range(96):
		current_distance = distance(geocord_A,(data[i][1][6],data[i][2][6]))
		if current_distance<minimum:
			minimum = current_distance
			minimum_index = i
	return list(data[minimum_index][0])

def gas_consumption_liste(liste_geocord):
	#give the gas consumption for all the locations (normalize values)
	data = create_data_gas_consumption()
	n = len(liste_geocord)
	results = []
	for g in range(n):
		minimum = distance(liste_geocord[g],(data[0][1][6],data[0][2][6]))
		minimum_index = 0
		for i in range(96):
			current_distance = distance(liste_geocord[g],(data[i][1][6],data[i][2][6]))
			if current_distance<minimum:
				minimum = current_distance
				minimum_index = i
		results.append(list(data[minimum_index][0]))
	maximum = max_list_of_lists(results)
	minimum = min_list_of_lists(results)
	for i in range(n):
		for annee in range(7):
			results[i][annee] = 1/(maximum-minimum)*(results[i][annee] - minimum) 
	return results






